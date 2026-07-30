import prisma from '../config/db.js';

export const getColdEmails = async (req, res) => {
  try {
    const coldEmails = await prisma.coldEmail.findMany({
      orderBy: { sentDate: 'desc' },
    });

    const today = new Date();
    const enriched = coldEmails.map((e) => {
      const sent = new Date(e.sentDate);
      const daysSince = Math.floor((today - sent) / (1000 * 60 * 60 * 24));
      return {
        ...e,
        followUpDue: !e.responseReceived && daysSince >= 5,
        daysSinceSent: daysSince,
      };
    });

    return res.json({ success: true, coldEmails: enriched });
  } catch (err) {
    console.error('[GET /cold-emails]', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const addColdEmail = async (req, res) => {
  try {
    const { company, recruiterName, recruiterEmail, sentDate, followUpDate, status, notes } = req.body;
    if (!company || !sentDate) {
      return res.status(400).json({ success: false, error: 'Company and sentDate are required.' });
    }

    const coldEmail = await prisma.coldEmail.create({
      data: {
        company,
        recruiterName: recruiterName || null,
        recruiterEmail: recruiterEmail || null,
        sentDate,
        followUpDate: followUpDate || null,
        status: status || 'Sent',
        notes: notes || null,
      },
    });
    return res.status(201).json({ success: true, coldEmail });
  } catch (err) {
    console.error('[POST /cold-emails]', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const updateColdEmail = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updated = await prisma.coldEmail.update({
      where: { id },
      data: req.body,
    });
    return res.json({ success: true, coldEmail: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteColdEmail = async (req, res) => {
  try {
    await prisma.coldEmail.delete({ where: { id: parseInt(req.params.id) } });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
