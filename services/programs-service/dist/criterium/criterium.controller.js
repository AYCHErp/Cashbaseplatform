"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const criterium_service_1 = require("./criterium.service");
const dto_1 = require("./dto");
const swagger_1 = require("@nestjs/swagger");
let CriteriumController = class CriteriumController {
    constructor(criteriumService) {
        this.criteriumService = criteriumService;
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.criteriumService.findAll();
        });
    }
    create(criteriumData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.criteriumService.create(criteriumData);
        });
    }
};
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CriteriumController.prototype, "findAll", null);
__decorate([
    swagger_1.ApiOperation({ title: 'Create criterium' }),
    swagger_1.ApiResponse({ status: 201, description: 'The criterium has been successfully created.' }),
    swagger_1.ApiResponse({ status: 403, description: 'Forbidden.' }),
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateCriteriumDto]),
    __metadata("design:returntype", Promise)
], CriteriumController.prototype, "create", null);
CriteriumController = __decorate([
    swagger_1.ApiBearerAuth(),
    swagger_1.ApiUseTags('criteriums'),
    common_1.Controller('criteriums'),
    __metadata("design:paramtypes", [criterium_service_1.CriteriumService])
], CriteriumController);
exports.CriteriumController = CriteriumController;
//# sourceMappingURL=criterium.controller.js.map