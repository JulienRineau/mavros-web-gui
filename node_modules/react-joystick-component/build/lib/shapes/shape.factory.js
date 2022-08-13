"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shapeFactory = void 0;
var shape_enum_1 = require("../enums/shape.enum");
var shapeFactory = function (shape, size) {
    switch (shape) {
        case shape_enum_1.JoystickShape.Circle:
            return {
                borderRadius: size,
            };
        case shape_enum_1.JoystickShape.Square:
            return {
                borderRadius: Math.sqrt(size)
            };
    }
};
exports.shapeFactory = shapeFactory;
//# sourceMappingURL=shape.factory.js.map