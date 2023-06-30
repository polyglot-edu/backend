import axios from "axios";
import parse from "node-html-parser";


export const getSubConceptMap = async (concepts: string[]) => {
  const map: {[x: string]: string[]} = {}

  // initialization 
  concepts.forEach((concept) => {
    map[concept] = []
  });
  

  await Promise.all(concepts.map(async (concept) => {
    try {
      const resp = await axios.get(`https://en.wikipedia.org/wiki/${concept.replaceAll(" ", "_")}`)
      const root = parse(resp.data);

      // search all subconcepts
      root.querySelectorAll("  p > a , .navigation-not-searchable a").forEach((elem) => {
        const subConcept = elem.getAttribute("href")
          ?.replace("/wiki/", "")
          .replaceAll("_", " ")
          .replaceAll(" \\(.+\\)","")
          .toLowerCase()


        if (!subConcept) return;
        
        map[concept].push(subConcept);

      });
    } catch (err) {
      console.log(err);
    }
  }));


  return map;
}

export const getGraph = (subConceptMap: {[x: string]:string[]}, indexes: string[]) => {
  const edges: any[] = []
  const nodes: any[] = indexes.map((concept, id) => (
    {
      name: concept,
      size: 1,
      node_id: id
    }
  ));

  // Async parallel (? need to be proved) operation
  indexes.forEach((index, id) => {
    indexes.forEach((index2, id2) => {
      if (index === index2) return;
      
      // Check if there are some duplicates linear cost O(n+m)
      const union = new Set([...subConceptMap[index], ...subConceptMap[index2]]);
      if (union.size < (subConceptMap[index].length + subConceptMap[index2].length) ) {
        edges.push({from: id, to: id2, edge: 1})
      }
    });
  })

  return {nodes:nodes, edges: edges};
}