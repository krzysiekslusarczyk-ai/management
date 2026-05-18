const prisma = require('../config/database');

const getAllPharmacies = async (req, res) => {
  try {
    const pharmacies = await prisma.pharmacy.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { users: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({ data: pharmacies });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to fetch pharmacies', details: error.message } });
  }
};

const getPharmacyById = async (req, res) => {
  try {
    const { id } = req.params;

    const pharmacy = await prisma.pharmacy.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true
              }
            }
          }
        }
      }
    });

    if (!pharmacy) {
      return res.status(404).json({ error: { message: 'Pharmacy not found' } });
    }

    res.json({ data: pharmacy });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to fetch pharmacy', details: error.message } });
  }
};

const createPharmacy = async (req, res) => {
  try {
    const { name, address, city, phoneNumber } = req.body;

    const pharmacy = await prisma.pharmacy.create({
      data: {
        name,
        address,
        city,
        phoneNumber
      }
    });

    res.status(201).json({ data: pharmacy });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to create pharmacy', details: error.message } });
  }
};

const updatePharmacy = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, city, phoneNumber, isActive } = req.body;

    const pharmacy = await prisma.pharmacy.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(address && { address }),
        ...(city && { city }),
        ...(phoneNumber && { phoneNumber }),
        ...(isActive !== undefined && { isActive })
      }
    });

    res.json({ data: pharmacy });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to update pharmacy', details: error.message } });
  }
};

const assignUserToPharmacy = async (req, res) => {
  try {
    const { pharmacyId } = req.params;
    const { userId } = req.body;

    const assignment = await prisma.userPharmacy.create({
      data: {
        userId,
        pharmacyId
      }
    });

    res.status(201).json({ data: assignment });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: { message: 'User already assigned to this pharmacy' } });
    }
    res.status(500).json({ error: { message: 'Failed to assign user', details: error.message } });
  }
};

module.exports = {
  getAllPharmacies,
  getPharmacyById,
  createPharmacy,
  updatePharmacy,
  assignUserToPharmacy
};
