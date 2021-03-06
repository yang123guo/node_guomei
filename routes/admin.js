'use strict';

import express from 'express'
import Admin from '../controller/admin/admin'
const router = express.Router()


// 关于admin的router对象 和admin拼接起来 是二级子路由
router.post('/login', Admin.login);
router.get('/singout', Admin.singout);
router.get('/all', Admin.getAllAdmin);
router.get('/count', Admin.getAdminCount);
router.get('/info', Admin.getAdminInfo);
router.post('/update/avatar/:admin_id', Admin.updateAvatar);

export default router