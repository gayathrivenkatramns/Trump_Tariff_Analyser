module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define(
    "UserRole",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      role: {
        type: DataTypes.ENUM("Admin", "User", "Analyst"),
        allowNull: false,
        defaultValue: "User"
      },
      status: {
        type: DataTypes.ENUM("Active", "Inactive"),
        allowNull: false,
        defaultValue: "Active"
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true
      },
      joinDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
      }
    },
    {
      tableName: "User_role",
      timestamps: false 
    }
  );

  return UserRole;
};
