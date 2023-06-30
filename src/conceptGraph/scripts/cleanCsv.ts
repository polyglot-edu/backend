
import fs from "fs";
import { removeColumnsCsv } from "../../utils/csv";

(async () => {
  const outputDir = "./src/conceptGraph/tmp"
  const materialDir = "./src/conceptGraph/material"
  if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir);
  }
  try {
    await removeColumnsCsv(["Original_identifier","Subject","Creator","Format","Type","Date","Text","detailed_subject","rights","Source","roer_url","oer_url","Publisher","Coverage","ROER","Language","status_code","Contributor","Relation","table_of_contents","Completeness","Authority","Overall_score","Publisher_source"], `${materialDir}/encore_oers.csv`, `${outputDir}/encore_oers.csv`);
    await removeColumnsCsv([""], `${materialDir}/OER_and_concept_table.csv`, `${outputDir}/OER_and_concept_table.csv`);
    await removeColumnsCsv([""], `${materialDir}/OER_and_wiki_relationships_hyperlinks_NEW.csv`, `${outputDir}/OER_and_wiki_relationships_hyperlinks_NEW.csv`);
  } catch(err) {
    console.error(err);
    throw(err);
  }
  
})()