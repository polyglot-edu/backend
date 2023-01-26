import { Request, Response } from "express";
import {exec} from "child_process"

export async function convert(req: Request, res: Response){
  exec("echo \"" + req.body.data + "\" > test.smv", 
    (error: any, stdout: string, stderr: string) =>{
      if (error != null) {
        console.log("ERRORE: " + error);
        return res.status(500).json({ Error: error });
      } else {
        exec('wine wsynth.exe -model_type dn -out_type dot -algo agaf_then_acyclic_preferences -agaf states -mono -dynamic -reachability_analysis ./test.smv > output.dot 2>&1 ',
          (error: any, stdout: string, stderr: string) =>{
            if (error != null) {
              console.log("ERRORE: " + error);
              return res.status(500).json({ Error: error });
            } else {
              exec('cat output.dot',
                (error: any, stdout: string, stderr: string) =>{
                  if (error != null) {
                    console.log("ERRORE: " + error);
                    return res.status(500).json({ Error: error });
                  } else {
                    console.log("OK: " + stdout);
                    return res.status(200).json({ Data: stdout });
                  }
                })
            }
          })
      }
    })
}

