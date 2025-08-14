import { NextFunction, Request, Response } from "express";
import PolyglotFileModel from "../models/file.model";
import PolyglotFlowModel from "../models/flow.model";
const multer = require("multer");
//creazione path
const fs = require("fs");
const path = require("path");

const baseUploadsDir = path.join(__dirname, "../../uploads");

const createUploadsDir = (dir: any) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}
type RequestWithFile = Request & { file?: MulterFile };

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    const nodeId = req.params.id; // ID del nodo passato come parametro
    const uploadsDir = path.join(baseUploadsDir, nodeId.toString());

    // Crea la directory per il nodo se non esiste
    createUploadsDir(uploadsDir);

    cb(null, uploadsDir); // directory dove salvare i file
  },
  filename: (req: any, file: any, cb: any) => {
    cb(null, Date.now() + "-" + file.originalname); // nome file con timestamp
  },
});

const upload = multer({ storage });

// API di Upload
export const uploadFile = [
  upload.single("file"), // middleware multer per gestire l'upload del file
  async (req: RequestWithFile, res: Response) => {
    // Usa RequestWithFile qui
    const nodeId = req.params.id; // ID del nodo passato come parametro
    const name = req.body.name;
    try {
      // Controlla se il file è stato caricato
      if (!req.file) {
        return res.status(400).json({ message: "Nessun file caricato" });
      }

      // Crea o aggiorna il file associato al nodo
      const updatedFile = await PolyglotFileModel.findByIdAndUpdate(
        nodeId,
        {
          _id: nodeId,
          filename: req.file.filename,
          path: req.file.path,
          uploadedAt: new Date(),
          name: name,
        },
        { upsert: true, new: true },
      );
      console.log(updatedFile);
      res.json({ message: "File caricato con successo", file: updatedFile });
    } catch (error) {
      console.error(error); // Log dell'errore per debugging
      res.status(500).json({ message: "Errore durante l'upload del file" });
    }
  },
];

// API di Download
export const download = async (req: Request, res: Response) => {
  const nodeId = req.params.id; // ID del nodo passato come parametro

  try {
    // Trova il file associato al nodo
    const file = await PolyglotFileModel.findById(nodeId);

    if (!file) {
      return res.status(304).json({ message: "File not found" });
    }

    res.header("Access-Control-Expose-Headers", "Content-Disposition");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.filename}"`,
    );
    res.download(file.path, file.filename);
  } catch (error) {
    console.error(error); // Log dell'errore per debugging
    res.status(500).json({ message: "Error during download" });
  }
};

export async function fileCleanUp(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (req.params.password != "polyglotClean") throw "Wrong password";

    const files = await PolyglotFileModel.find();
    const flows = await PolyglotFlowModel.find();

    const validNodeIds = flows.flatMap((flow) =>
      flow.nodes.map((node) => node._id),
    );

    const filesToRemove = files.filter(
      (file) => !validNodeIds.includes(file._id),
    );

    if (filesToRemove.length > 0) {
      const resp = await PolyglotFileModel.deleteMany({
        _id: { $in: filesToRemove.map((file) => file._id) },
      });
      console.log(
        `Rimossi ${resp.deletedCount} file non associati a nessun nodo.`,
      );
      res
        .status(204)
        .json(`Rimossi ${resp.deletedCount} file non associati a nessun nodo.`);
    } else {
      console.log("Nessun file da rimuovere.");
      res.status(200).json("Nessun file da rimuovere.");
    }

    res.status(204).json();
  } catch (error) {
    next(error);
  }
}
