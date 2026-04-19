"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var zod_1 = require("zod");
var clientSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    branch: zod_1.z.string().optional(),
    city: zod_1.z.string().min(1, 'City is required'),
    address: zod_1.z.string().optional(),
    latitude: zod_1.z.number().optional(),
    longitude: zod_1.z.number().optional(),
    isActive: zod_1.z.boolean().default(true)
});
var v = { name: '1', city: '1' };
var d = v;
