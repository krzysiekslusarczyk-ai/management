const prisma = require('../config/database');
const { parseISO } = require('date-fns');

const getAllAbsences = async (req, res) => {
  try {
    const { userId, isApproved } = req.query;

    const where = {};
    if (userId) where.userId = userId;
    if (isApproved !== undefined) where.isApproved = isApproved === 'true';

    const absences = await prisma.absence.findMany({
      where,
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
      orderBy: { startDate: 'desc' }
    });

    res.json({ data: absences });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to fetch absences', details: error.message } });
  }
};

const createAbsence = async (req, res) => {
  try {
    const { startDate, endDate, absenceType, reason } = req.body;

    const absence = await prisma.absence.create({
      data: {
        userId: req.user.id,
        startDate: parseISO(startDate),
        endDate: parseISO(endDate),
        absenceType,
        reason
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.status(201).json({ data: absence });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to create absence', details: error.message } });
  }
};

const updateAbsence = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, absenceType, reason } = req.body;

    const absence = await prisma.absence.update({
      where: { id },
      data: {
        ...(startDate && { startDate: parseISO(startDate) }),
        ...(endDate && { endDate: parseISO(endDate) }),
        ...(absenceType && { absenceType }),
        ...(reason !== undefined && { reason })
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.json({ data: absence });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to update absence', details: error.message } });
  }
};

const approveAbsence = async (req, res) => {
  try {
    const { id } = req.params;

    const absence = await prisma.absence.update({
      where: { id },
      data: {
        isApproved: true,
        approvedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.json({ data: absence });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to approve absence', details: error.message } });
  }
};

const deleteAbsence = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.absence.delete({
      where: { id }
    });

    res.json({ data: { message: 'Absence deleted successfully' } });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to delete absence', details: error.message } });
  }
};

module.exports = {
  getAllAbsences,
  createAbsence,
  updateAbsence,
  approveAbsence,
  deleteAbsence
};
