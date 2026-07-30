import prisma from '../config/db.js';

export const getAnalytics = async (req, res) => {
  try {
    const [allApps, allColdEmails] = await Promise.all([
      prisma.application.findMany(),
      prisma.coldEmail.findMany(),
    ]);

    const total = allApps.length;
    const interviews = allApps.filter((a) => /interview/i.test(a.status)).length;
    const offers = allApps.filter((a) => /offer/i.test(a.status)).length;
    const rejections = allApps.filter((a) => /reject/i.test(a.status)).length;
    const pending = total - interviews - offers - rejections;
    const coldEmailsSent = allColdEmails.length;
    const coldResponses = allColdEmails.filter((e) => e.responseReceived).length;
    const responseRate = coldEmailsSent > 0 ? Math.round((coldResponses / coldEmailsSent) * 100) : 0;

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const thisWeek = allApps.filter((a) => new Date(a.createdAt) >= weekAgo).length;

    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthLabel = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      const count = allApps.filter((a) => {
        const appDate = new Date(a.createdAt);
        return appDate.getMonth() === d.getMonth() && appDate.getFullYear() === d.getFullYear();
      }).length;
      monthlyTrend.push({ month: monthLabel, count });
    }

    const sourceCounts = {};
    allApps.forEach((a) => {
      const src = a.source || 'Unknown';
      sourceCounts[src] = (sourceCounts[src] || 0) + 1;
    });
    const platformData = Object.entries(sourceCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    const statusCounts = {};
    allApps.forEach((a) => {
      statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
    });

    return res.json({
      success: true,
      stats: {
        total, interviews, offers, rejections, pending,
        coldEmailsSent, coldResponses, responseRate, thisWeek,
      },
      monthlyTrend,
      platformData,
      statusCounts,
    });
  } catch (err) {
    console.error('[GET /analytics]', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};
