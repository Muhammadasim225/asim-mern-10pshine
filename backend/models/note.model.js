module.exports = (sequelize, DataTypes) => {
    const Note = sequelize.define(
      "Note",
      {
        id: {
          type: DataTypes.UUID,      
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        userId: {
          type: DataTypes.UUID,    
          allowNull: false,
        },
      },
      {
        timestamps: true,            
      }
    );
  
    // Associations (Note belongs to User)
    Note.associate = (models) => {
        Note.belongsTo(models.user, {
          foreignKey: 'userId',
          as: 'user',
        });
      };
  
    return Note;
  };
  