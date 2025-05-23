import express from "express";
import {addSkill, getAllSkills, deleteSkill, updateSkill} from "../controllers/skillController.js"

const router = express.Router();

router.post("/addSkill", addSkill)

router.get("/getAllSkills/:email", getAllSkills)

router.delete("/deleteSkill/:id", deleteSkill);

router.put("/updateSkill/:id", updateSkill);

export default router