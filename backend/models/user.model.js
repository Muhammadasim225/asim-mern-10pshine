module.exports=(sequelize,DataTypes)=>{
    const User = sequelize.define(
        'User',
        {
          id: {
            type: DataTypes.UUID,            
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
          },

          full_name: {
            type: DataTypes.STRING,
            allowNull: false,
          },

          email_address: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, 
          },

          password: {
            type: DataTypes.STRING,
            allowNull: false,
          },
        },
        {
          timestamps: true,
        },
      );
      User.associate = (models) => {
        User.hasMany(models.notes, {
          foreignKey: 'userId',
          as: 'notes',
        });
      }
    
      return User;

}