const prisma = require('../config/database');
const { parseISO, isAfter, isBefore } = require('date-fns');

const getAllSchedules = async (req, res) => {
  try {
    const { pharmacyId, status } = req.query;

    const where = {};
    if (pharmacyId) where.pharmacyId = pharmacyId;
    if (status) where.status = status;

    const schedules = await prisma.schedule.findMany({
      where,
      include: {
        pharmacy: {
          select: {
            id: true,
            name: true,
            city: true
          }
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        approvedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        _count: {
          select: { shifts: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ data: schedules });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to fetch schedules', details: error.message } });
  }
};

const getScheduleById = async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await prisma.schedule.findUnique({
      where: { id },
      include: {
        pharmacy: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true
          }
        },
        approvedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        shifts: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                role: true
              }
            }
          },
          orderBy: { date: 'asc' }
        }
      }
    });

    if (!schedule) {
      return res.status(404).json({ error: { message: 'Schedule not found' } });
    }

    res.json({ data: schedule });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to fetch schedule', details: error.message } });
  }
};

const createSchedule = async (req, res) => {
  try {
    const { pharmacyId, startDate, endDate, notes } = req.body;

    const schedule = await prisma.schedule.create({
      data: {
        pharmacyId,
        startDate: parseISO(startDate),
        endDate: parseISO(endDate),
        createdById: req.user.id,
        notes
      },
      include: {
        pharmacy: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.status(201).json({ data: schedule });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to create schedule', details: error.message } });
  }
};

const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, notes, status } = req.body;

    const updateData = {
      ...(startDate && { startDate: parseISO(startDate) }),
      ...(endDate && { endDate: parseISO(endDate) }),
      ...(notes !== undefined && { notes }),
      ...(status && { status })
    };

    const schedule = await prisma.schedule.update({
      where: { id },
      data: updateData,
      include: {
        pharmacy: true,
        shifts: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    res.json({ data: schedule });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to update schedule', details: error.message } });
  }
};

const approveSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await prisma.schedule.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedById: req.user.id,
        approvedAt: new Date()
      },
      include: {
        pharmacy: true,
        approvedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.json({ data: schedule });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to approve schedule', details: error.message } });
  }
};

const publishSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const schedule = await prisma.schedule.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date()
      }
    });

    res.json({ data: schedule });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to publish schedule', details: error.message } });
  }
};

module.exports = {
  getAllSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  approveSchedule,
  publishSchedule
};
