const prisma = require('../config/database');
const { parseISO, isSameDay, isWithinInterval } = require('date-fns');

const checkShiftConflict = async (userId, date, startTime, endTime, excludeShiftId = null) => {
  const shiftsOnDate = await prisma.shift.findMany({
    where: {
      userId,
      date: parseISO(date),
      ...(excludeShiftId && { id: { not: excludeShiftId } })
    }
  });

  for (const shift of shiftsOnDate) {
    const existingStart = shift.startTime;
    const existingEnd = shift.endTime;

    // Check for time overlap
    if (
      (startTime >= existingStart && startTime < existingEnd) ||
      (endTime > existingStart && endTime <= existingEnd) ||
      (startTime <= existingStart && endTime >= existingEnd)
    ) {
      return true;
    }
  }

  return false;
};

const createShift = async (req, res) => {
  try {
    const { scheduleId, userId, date, shiftType, startTime, endTime, notes } = req.body;

    // Check for conflicts
    const hasConflict = await checkShiftConflict(userId, date, startTime, endTime);
    if (hasConflict) {
      return res.status(400).json({ error: { message: 'Shift conflict detected for this user' } });
    }

    // Check for absences
    const absence = await prisma.absence.findFirst({
      where: {
        userId,
        isApproved: true,
        startDate: { lte: parseISO(date) },
        endDate: { gte: parseISO(date) }
      }
    });

    if (absence) {
      return res.status(400).json({
        error: {
          message: 'User has an approved absence on this date',
          absence
        }
      });
    }

    const shift = await prisma.shift.create({
      data: {
        scheduleId,
        userId,
        date: parseISO(date),
        shiftType,
        startTime,
        endTime,
        notes
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true
          }
        },
        schedule: {
          select: {
            id: true,
            status: true
          }
        }
      }
    });

    res.status(201).json({ data: shift });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to create shift', details: error.message } });
  }
};

const updateShift = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, date, shiftType, startTime, endTime, notes } = req.body;

    // If date/time is being updated, check for conflicts
    if (userId || date || startTime || endTime) {
      const existingShift = await prisma.shift.findUnique({ where: { id } });
      const checkUserId = userId || existingShift.userId;
      const checkDate = date || existingShift.date.toISOString();
      const checkStartTime = startTime || existingShift.startTime;
      const checkEndTime = endTime || existingShift.endTime;

      const hasConflict = await checkShiftConflict(checkUserId, checkDate, checkStartTime, checkEndTime, id);
      if (hasConflict) {
        return res.status(400).json({ error: { message: 'Shift conflict detected' } });
      }
    }

    const shift = await prisma.shift.update({
      where: { id },
      data: {
        ...(userId && { userId }),
        ...(date && { date: parseISO(date) }),
        ...(shiftType && { shiftType }),
        ...(startTime && { startTime }),
        ...(endTime && { endTime }),
        ...(notes !== undefined && { notes })
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true
          }
        }
      }
    });

    res.json({ data: shift });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to update shift', details: error.message } });
  }
};

const deleteShift = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.shift.delete({
      where: { id }
    });

    res.json({ data: { message: 'Shift deleted successfully' } });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to delete shift', details: error.message } });
  }
};

const getShiftsBySchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;

    const shifts = await prisma.shift.findMany({
      where: { scheduleId },
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
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }]
    });

    res.json({ data: shifts });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to fetch shifts', details: error.message } });
  }
};

module.exports = {
  createShift,
  updateShift,
  deleteShift,
  getShiftsBySchedule
};
