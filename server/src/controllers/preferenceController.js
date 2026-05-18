const prisma = require('../config/database');

const getMyPreferences = async (req, res) => {
  try {
    const preference = await prisma.preference.findFirst({
      where: { userId: req.user.id },
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

    res.json({ data: preference });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to fetch preferences', details: error.message } });
  }
};

const getUserPreferences = async (req, res) => {
  try {
    const { userId } = req.params;

    const preference = await prisma.preference.findFirst({
      where: { userId },
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

    res.json({ data: preference });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to fetch preferences', details: error.message } });
  }
};

const createOrUpdatePreference = async (req, res) => {
  try {
    const { preferredDays, preferredShiftTypes, notes } = req.body;

    // Check if preference already exists
    const existingPreference = await prisma.preference.findFirst({
      where: { userId: req.user.id }
    });

    let preference;

    if (existingPreference) {
      preference = await prisma.preference.update({
        where: { id: existingPreference.id },
        data: {
          preferredDays,
          preferredShiftTypes,
          notes
        }
      });
    } else {
      preference = await prisma.preference.create({
        data: {
          userId: req.user.id,
          preferredDays,
          preferredShiftTypes,
          notes
        }
      });
    }

    res.json({ data: preference });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to save preferences', details: error.message } });
  }
};

const deletePreference = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.preference.delete({
      where: { id }
    });

    res.json({ data: { message: 'Preference deleted successfully' } });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to delete preference', details: error.message } });
  }
};

module.exports = {
  getMyPreferences,
  getUserPreferences,
  createOrUpdatePreference,
  deletePreference
};
