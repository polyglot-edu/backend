import {
  GameEngine,
  SmartCampusGameEngine,
} from "../gamification/gamification";
import {
  PolyglotEdge,
  PolyglotEdgeFailDebtData,
  PolyglotFlow,
  PolyglotNode,
  PolyglotNodeValidation,
} from "../types";
import {
  getAbstractAlgorithm,
  getPathSelectorAlgorithm,
  pathSelectorMap,
} from "./algo/register";
import { AbstractAlgorithm, DistrubutionAlgorithm } from "./algo/base";
import { nodeTypeExecution } from "./plugins/pluginMap";
import { API } from "../api/api";
import { EducationLevel, LearningOutcome } from "../types";
const mapType = {
  0: "OpenQuestionNode",
  2: "TrueFalseNode",
  3: "closeEndedQuestionNode",
  4: "multipleChoiceQuestionNode",
};

export type ExecCtx = {
  flowId: string;
  username?: string;
  userId: string | null;
  gameId: string;
  currentNodeId: string;
  execNodeInfo: ExecCtxNodeInfo;
};

export type ExecCtxNodeInfo = { [x: string]: any };

export type ExecProps = {
  ctx: ExecCtx;
  algo: string;
  flow: PolyglotFlow;
};

export class Execution {
  private ctx: ExecCtx;
  private algo: DistrubutionAlgorithm;
  private abstractAlgo: AbstractAlgorithm | null;
  private flow: PolyglotFlow;
  private gameEngine: GameEngine;

  constructor(params: ExecProps) {
    const { ctx, algo, flow } = params;

    if (!pathSelectorMap[algo]) {
      throw Error("Path selector algorithm not set");
    }

    this.ctx = ctx;
    this.abstractAlgo = null;
    this.algo = getPathSelectorAlgorithm(algo, ctx);
    this.flow = flow;
    this.gameEngine = new SmartCampusGameEngine();

    // TODO: refactor
    this.algo.setFlow(flow);
  }

  public static createCtx(
    flowId: string,
    currentNodeId: string,
    userId?: string,
    username?: string,
  ) {
    return {
      flowId: flowId,
      userId: userId ?? null,
      currentNodeId: currentNodeId,
      username: username ?? "guest",
      execNodeInfo: {},
    } as ExecCtx;
  }

  // TODO: check if the first node is an abstract node
  public getFirstExercise(
    username?: string,
    userId?: string,
  ): {
    ctx: ExecCtx;
    node: PolyglotNodeValidation | null;
  } {
    const nodesWithIncomingEdges = new Set(
      this.flow.edges.map((edge) =>
        this.flow.nodes.find(
          (node) => node.reactFlow.id === edge.reactFlow.target,
        ),
      ),
    );
    const nodesWithoutIncomingEdges = this.flow.nodes.filter(
      (node) => !nodesWithIncomingEdges.has(node),
    );
    // if (nodesWithoutIncomingEdges.length === 0) return null;

    const firstNode =
      nodesWithoutIncomingEdges[
        Math.floor(Math.random() * nodesWithoutIncomingEdges.length)
      ];
    const outgoingEdges = this.flow.edges.filter(
      (edge) => edge.reactFlow.source === firstNode.reactFlow.id,
    );

    const ctx = Execution.createCtx(
      this.flow._id,
      firstNode._id,
      userId,
      username,
    );

    const actualNode: PolyglotNodeValidation = {
      ...nodeTypeExecution(
        JSON.parse(JSON.stringify(firstNode)),
        ctx.toString(),
      )!,
      validation: outgoingEdges.map((e) => ({
        id: e.reactFlow.id,
        title: e.title,
        code: e.code,
        data: e.data,
        type: e.type,
      })),
    };
    return {
      ctx: ctx,
      node: actualNode,
    };
  }

  public getCurrentNode() {
    return (
      this.flow.nodes.find((node) => node._id === this.ctx.currentNodeId) ??
      null
    );
  }

  public getActualNode(ctxId: string) {
    const currentNode = this.getCurrentNode();
    return this.selectAlgoRec(this.ctx.execNodeInfo, currentNode, null, ctxId);
  }

  private async selectAlgoRec(
    execNodeInfo: ExecCtxNodeInfo,
    currentNode: PolyglotNode | null,
    satisfiedEdges: PolyglotEdge[] | null,
    ctxId: string,
  ): Promise<{ ctx: ExecCtx; node: PolyglotNodeValidation | null }> {
    // caso in cui current node è null (fine esecuzione)
    if (!currentNode) {
      return { ctx: this.ctx, node: null };
    }
    const outgoingEdges = this.flow.edges.filter(
      (edge) => edge.reactFlow.source === currentNode.reactFlow.id,
    );
    const actualNode: PolyglotNodeValidation = {
      ...nodeTypeExecution(JSON.parse(JSON.stringify(currentNode)), ctxId)!,
      validation: outgoingEdges.map((e) => ({
        id: e.reactFlow.id,
        title: e.title,
        code: e.code,
        data: e.data,
        type: e.type,
      })),
    };

    if (satisfiedEdges) {
      if (satisfiedEdges[0].type == "failDebtEdge") {
        //case where there is a debt in the fail edge
        //to be updated with new AI GENERATION API and new concept of "failDebt throw"
        /*const debtEdgeData: PolyglotEdgeFailDebtData = satisfiedEdges[0]
          .data as PolyglotEdgeFailDebtData;
        let correctAnswersNumber: number = 1;
        let distractorsNumber: number = 1;
        let easilyDiscardableDistractorsNumber: number = 1;
        let exType = "OpenQuestionNode";
        if (debtEdgeData.typeOfExercise == 2) {
          exType = "TrueFalseNode";
        } else if (debtEdgeData.typeOfExercise == 3) {
          //case closeEndedQuestion
          exType = "closeEndedQuestionNode";
        } else if (debtEdgeData.typeOfExercise == 4) {
          //case multichoiceQuestion
          exType = "multipleChoiceQuestionNode";
          distractorsNumber = 2;
          easilyDiscardableDistractorsNumber = 1;
        }
        const response = await API.generateNewExercise({
          //fix aaaaaaaaaaaaaaaaaaaaaa
          title: "",
          macro_subject: "",
          topics: [],
          education_level: EducationLevel.ElementarySchool,
          learning_outcome: LearningOutcome.RecallRecognize,
          duration: 0,
          language: "",
          model: "",
        });
        let dataGen;
        switch (debtEdgeData.typeOfExercise) {
          case 0:
            console.log("creating openQuestion");
            dataGen = {
              question: response.data.Assignment,
              material: debtEdgeData.material,
              aiQuestion: false,
              possibleAnswer: response.data.Solutions[0],
            };
            break; 
                  case 2:
                    console.log('creating trueFalse');
                    dataGen = {
                      question: response.data.Assignment,
                      material: sourceMaterial,
                      aiQuestion: false,
                      possibleAnswer: response.data.Solutions[0],
                    };
                    break;
                  
          case 3:
            console.log("creating close_ended_question");
            const question =
              response.data.Assignment + "\n" + response.data.Plus;
            dataGen = {
              question: question,
              correctAnswers: response.data.Solutions,
            };
            break;
          case 4:
            console.log("creating multichoice");

            const answers = [].concat(
              response.data.Solutions,
              response.data.Distractors,
              response.data.EasilyDiscardableDistractors,
            ); //response.data.
            answers.sort(() => Math.random() - 0.5);

            const isAnswerCorrect = new Array(answers.length).fill(false);
            answers.forEach((value, index) => {
              if (response.data.Solutions.includes(value))
                isAnswerCorrect[index] = true;
            });
            if (exType == "TrueFalseNode")
              dataGen = {
                instructions: "Argument: " + response.data.Assignment,
                questions: answers,
                isQuestionCorrect: isAnswerCorrect,
              };
            else
              dataGen = {
                question: response.data.Assignment,
                choices: answers,
                isChoiceCorrect: isAnswerCorrect,
              };
            break;
          default:
            console.log("error in exerciseType");
            throw ": generated type error";
        }
        const ghostNode: PolyglotNodeValidation = {
          _id: "ghost",
          description: "This is a debt activity, complete it to proceed",
          difficulty: 1,
          runtimeData: "ghost",
          platform: "WebApp",
          reactFlow: {},
          title: debtEdgeData.title,
          type: exType,
          data: dataGen,
          validation: [
            {
              id: satisfiedEdges[0]._id,
              title: "ghost",
              code: '\nasync Task<(bool, string)> validate(PolyglotValidationContext context) {\n    return (true, "Unconditional edge");\n}',
              data: {
                conditionKind: "pass",
              },
              type: "unconditionalEdge",
            },
          ],
        };
        console.log("completed");
        this.ctx.currentNodeId = "ghostNode";
        return { ctx: this.ctx, node: ghostNode };
      */
        console.log("fail debt");
        return { ctx: this.ctx, node: null };
      }
      const possibleNextNodes = satisfiedEdges.map((edge) =>
        this.flow.nodes.find(
          (node) => node.reactFlow.id === edge.reactFlow.target,
        ),
      ) as PolyglotNode[];

      const { execNodeInfo, node } =
        this.algo.getNextExercise(possibleNextNodes);

      this.ctx.currentNodeId = node?.reactFlow.id;

      return await this.selectAlgoRec(execNodeInfo, node, null, ctxId);
    }

    // caso in cui mi sono calcolato il nodo successivo con l'algo normale e mi ha ritornato un nodo non astratto
    this.ctx.execNodeInfo = execNodeInfo;
    this.ctx.currentNodeId = currentNode.reactFlow.id; // todo check if needed
    return { ctx: this.ctx, node: actualNode };
  }

  private ghostNodeAdvance(
    execNodeInfo: ExecCtxNodeInfo,
    satisfiedEdges: PolyglotEdge[] | null,
    ctxId: string,
  ) {
    if (satisfiedEdges) {
      const currentNode = this.flow.nodes.find(
        (node) => node.reactFlow.id === satisfiedEdges[0].reactFlow.target,
      );
      if (!currentNode) return { ctx: this.ctx, node: null };
      const outgoingEdges = this.flow.edges.filter(
        (edge) => edge.reactFlow.source === currentNode.reactFlow.id,
      );
      const actualNode: PolyglotNodeValidation = {
        ...nodeTypeExecution(JSON.parse(JSON.stringify(currentNode)), ctxId)!,
        validation: outgoingEdges.map((e) => ({
          id: e.reactFlow.id,
          title: e.title,
          code: e.code,
          data: e.data,
          type: e.type,
        })),
      };
      this.ctx.execNodeInfo = execNodeInfo;
      this.ctx.currentNodeId = currentNode.reactFlow.id; // todo check if needed
      return { ctx: this.ctx, node: actualNode };
    }
    return { ctx: this.ctx, node: null };
  }

  public async getNextExercise(
    satisfiedConditions: string[],
    ctxId: string,
  ): Promise<{ ctx: ExecCtx; node: PolyglotNodeValidation | null }> {
    const { userId, gameId } = this.ctx;
    if (userId) {
      this.gameEngine.addPoints(gameId, userId, 100);
    }
    const satisfiedEdges = this.flow.edges.filter((edge) =>
      satisfiedConditions.includes(edge.reactFlow.id),
    );

    if (this.ctx.currentNodeId == "ghostNode") {
      //ghost Execution done
      console.log("qqqqqqqqqqqqqqqq");
      return await this.ghostNodeAdvance(
        this.ctx.execNodeInfo,
        satisfiedEdges,
        ctxId,
      );
    }

    const currentNode = this.getCurrentNode();

    return await this.selectAlgoRec(
      this.ctx.execNodeInfo,
      currentNode,
      satisfiedEdges,
      ctxId,
    );
  }
}
