import express from "express";
import {addSkill, getAllSkills} from "../controllers/skillController.js"

const router = express.Router();

router.post("/addSkill", addSkill)

router.post("/getAllSkills", getAllSkills)
export default router