const prisma = require('../config/database');

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phoneNumber: true,
        isActive: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ data: users });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to fetch users', details: error.message } });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phoneNumber: true,
        isActive: true,
        createdAt: true,
        pharmacies: {
          include: {
            pharmacy: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    res.json({ data: user });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to fetch user', details: error.message } });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phoneNumber, role, isActive } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phoneNumber !== undefined && { phoneNumber }),
        ...(role && { role }),
        ...(isActive !== undefined && { isActive })
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phoneNumber: true,
        isActive: true,
        updatedAt: true
      }
    });

    res.json({ data: user });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to update user', details: error.message } });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id }
    });

    res.json({ data: { message: 'User deleted successfully' } });
  } catch (error) {
    res.status(500).json({ error: { message: 'Failed to delete user', details: error.message } });
  }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
