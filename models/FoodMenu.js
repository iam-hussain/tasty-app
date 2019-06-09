module.exports = function (sequelize, DataTypes) {
    var FoodMenu = sequelize.define('food_menu', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'id'
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        notes: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        avilableStatus: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        morningStatus: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        launchStatus: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        dinnerStatus: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        foodType: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    }, {
        underscored: true,
        timestamps: true,
        freezeTableName: true
    });

    FoodMenu.associate = function (db) {
        db.FoodMenu.belongsTo(db.Restaurant)
        // db.FoodMenu.belongsTo(db.Restaurant, {
        //     as : 'FoodMenuofRestaurant',
        //     foreignKey: 'restaurant_id',
        //     onDelete: 'CASCADE',
        //     allowNull: true
        // });
        // db.FoodMenu.hasMany(db.FoodImage,{foreignKey: 'foodmenu_id'});
    }

    return FoodMenu;
}