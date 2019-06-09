module.exports = function (sequelize, DataTypes) {
    var FoodImage = sequelize.define('food_image', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            field: 'id'
        },
        avatar: {
            type: DataTypes.STRING,
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
        image_destination: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        mimetype: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        size: {
            type: DataTypes.INTEGER,
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

    FoodImage.associate = function (db) {
        // db.FoodImage.belongsTo(db.FoodMenu, {
        //     as : 'ImageofFoodMenu',
        //     foreignKey: 'foodmenu_id',
        //     onDelete: 'CASCADE',
        //     allowNull: true
        // });
    }

    return FoodImage;
}