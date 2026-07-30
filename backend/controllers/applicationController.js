import prisma from '../config/db.js';
import { extractFromImage } from '../services/extractionService.js';
import crypto from 'crypto';

export const uploadBulk = async (req, res) => {
  const files = req.files;
  if (!files || files.length === 0) {
    return res.status(400).json({ success: false, error: 'No image files uploaded.' });
  }

  const results = [];
  const errors = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      const imageHash = crypto.createHash('sha256').update(file.buffer).digest('hex');

      const existing = await prisma.application.findUnique({
        where: { imageHash },
      });

      if (existing) {
        errors.push({
          file: file.originalname,
          error: `Duplicate: This exact same image has already been uploaded.`,
          isDuplicate: true,
        });
      } else {
        const extracted = await extractFromImage(file.buffer, file.mimetype);

        const record = await prisma.application.create({
          data: {
            company: extracted.company,
            position: extracted.position,
            appliedDate: new Date().toISOString().split('T')[0],
            source: extracted.source || null,
            status: 'Applied',
            location: extracted.location || null,
            recruiter: extracted.recruiter || null,
            confidence: extracted.confidence || null,
            notes: null,
            imageHash,
          },
        });
        results.push({ file: file.originalname, data: record });
      }

      if (i < files.length - 1) {
        await new Promise((r) => setTimeout(r, 1200));
      }
    } catch (err) {
      console.error(`[upload-bulk] Error processing ${file.originalname}:`, err.message);
      errors.push({ file: file.originalname, error: err.message });
    }

    file.buffer = null;
  }

  return res.json({
    success: true,
    processed: results.length,
    failed: errors.length,
    results,
    errors,
  });
};

export const getApplications = async (req, res) => {
  try {
    const { search, status, source, sort = 'createdAt', order = 'desc', page = 1, limit = 50 } = req.query;

    const where = {};
    if (search) {
      where.OR = [
        { company: { contains: search } },
        { position: { contains: search } },
      ];
    }
    if (status && status !== 'all') where.status = status;
    if (source && source !== 'all') where.source = source;

    const [total, applications] = await Promise.all([
      prisma.application.count({ where }),
      prisma.application.findMany({
        where,
        orderBy: { [sort]: order },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
      }),
    ]);

    return res.json({ success: true, total, applications });
  } catch (err) {
    console.error('[GET /applications]', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const addApplication = async (req, res) => {
  try {
    const { company, position, appliedDate, source, status, location, recruiter, notes } = req.body;
    if (!company) {
      return res.status(400).json({ success: false, error: 'Company is required.' });
    }

    const application = await prisma.application.create({
      data: {
        company,
        position: position || null,
        appliedDate: appliedDate || new Date().toISOString().split('T')[0],
        source: source || 'Manual Entry',
        status: status || 'Applied',
        location: location || null,
        recruiter: recruiter || null,
        notes: notes || null,
      }
    });

    return res.status(201).json({ success: true, application });
  } catch (err) {
    console.error('[POST /applications]', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { company, position, appliedDate, source, status, location, recruiter, notes, tags } = req.body;

    const updated = await prisma.application.update({
      where: { id },
      data: {
        ...(company !== undefined && { company }),
        ...(position !== undefined && { position }),
        ...(appliedDate !== undefined && { appliedDate }),
        ...(source !== undefined && { source }),
        ...(status !== undefined && { status }),
        ...(location !== undefined && { location }),
        ...(recruiter !== undefined && { recruiter }),
        ...(notes !== undefined && { notes }),
        ...(tags !== undefined && { tags }),
      },
    });
    return res.json({ success: true, application: updated });
  } catch (err) {
    console.error('[PATCH /applications/:id]', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.application.delete({ where: { id } });
    return res.json({ success: true });
  } catch (err) {
    console.error('[DELETE /applications/:id]', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};
