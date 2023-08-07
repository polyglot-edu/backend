// export class SelectionDA extends DistrubutionAlgorithm {
//   public getNextExercise(possibleNextNodes: PolyglotNode[]) {
//     if (!this.flow) throw new Error("No flow found");
//     const currentNode = this.flow.nodes.find((node) => node._id === this.ctx.currentNodeId) as PolyglotNode;

//     // TODO: add check currentNode and remove imposition type

//     if (possibleNextNodes.length === 0 && currentNode.type !== "abstractNode") 
//       return {
//         ctx: this.ctx,
//         node: null
//       };

//     const randomNode = possibleNextNodes[Math.floor(Math.random() * possibleNextNodes.length)];

//     let nextNode: PolyglotNodeValidation;

//     // TODO: refactor algorithm inside another method
//     if (randomNode?.type === "abstractNode" || this.ctx.exec_node_info.count_node === 0) {
//         this.ctx.exec_node_info.count_node = 2;
//         nextNode = {
//           ...JSON.parse(JSON.stringify(choiceNode())),
//           validation: [
//             {
//               id: v4(),
//               title: "pass",
//               code: `async Task<(bool, string)> validate(PolyglotValidationContext context) {
//                 var cmd = context.JourneyContext.SubmittedCode;
                
//                 var resp = await GamificationClient.Current.SendCommand(cmd);
                    
//                 return (resp, \"Pass/Fail edge\");
//             }`,
//               data: {
//                 "conditionKind": "pass"
//               },
//               type: "passFailEdge",
//             }
//           ]
//         }
//         if (randomNode?.type === "abstractNode") this.ctx.currentNodeId = randomNode._id;
//     }else if (currentNode.type === "abstractNode"){
//       this.ctx.exec_node_info.count_node--;

//       // TODO: prendi nodo random in base alla scelta
//       nextNode = {
//         ...JSON.parse(JSON.stringify(genRandomNode())),
//         validation: [
//           {
//             id: v4(),
//             title: "pass",
//             code: `async Task<(bool, string)> validate(PolyglotValidationContext context) {
//               var cmd = context.JourneyContext.SubmittedCode;
              
//               var resp = await GamificationClient.Current.SendCommand(cmd);
                  
//               return (resp, \"Pass/Fail edge\");
//           }`,
//             data: {
//               "conditionKind": "pass"
//             },
//             type: "passFailEdge",
//           }
//         ]
//       }
//     } else {
//       this.ctx.currentNodeId = randomNode._id;
//       const outgoingEdges = this.flow.edges.filter(edge => edge.reactFlow.source === randomNode.reactFlow.id);
//       nextNode = {
//         ...JSON.parse(JSON.stringify(randomNode)),
//         validation: outgoingEdges.map(e => ({
//             id: e.reactFlow.id,
//             title: e.title,
//             code: e.code,
//             data: e.data,
//             type: e.type,
//           }))
//       }
//     }

//     return {
//       ctx: this.ctx,
//       node: nextNode
//     }
//   }

// }