import { PolyglotNode } from "../types";

export const getMultipleChoiceRuntimeData = (choices: string[], question: string) => {
  const choicesStr = choices.map((_, id) => `"${id+1}"`).join(", ");
  const markdown = "## " + question + choices.map((c,id) => "\n" + (id+1) + ". " + c).join(",")
  return {
    challengeSetup: [
        "\nusing Polyglot.Interactive;\nvar kernel = Kernel.Root.FindKernelByName(\"multiplechoice\") as MultipleChoiceKernel;\nkernel.Options = new HashSet<string> { "+ choicesStr +" };\n"
    ],
    challengeContent: [
        {
            type: "multiplechoice",
            content: "",
            priority: 1
        },
        {
            type: "markdown",
            content: markdown,
            priority: 0
        }
    ]
  }
}

const multipleChoiceWidget = () => `"""<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2/dist/tailwind.min.css" rel="stylesheet" type="text/css" /><script>const submit = (code,lang) => ({command: {code: code,targetKernelName: lang},commandType: "SubmitCode"});kernel.root.send(submit("1","multiplechoice"));</script><div class="container mx-auto rounded-md border-2 border-gray-900 bg-white text-black py-4 px-6"><div class="pb-4 font-medium text-lg">My Question:</div><div class="grid grid-cols-2 gap-4"><button class="flex rounded-md border-2 border-gray-900 p-8 justify-center">Option 1</button><button class="flex rounded-md border-2 border-gray-900 p-8 justify-center">Option 1</button><button class="flex rounded-md border-2 border-gray-900 p-8 justify-center">Option 1</button><button class="flex rounded-md border-2 border-gray-900 p-8 justify-center">Option 1</button></div></div>"""`

// Experimental
export const choiceNode = () : PolyglotNode => {
  return {
    type: "choiceNode",
    _id: "1",
    title: "choice node",
    description: "descriptiom",
    difficulty: 1,
    runtimeData: {
      challengeSetup: [
        "\nusing Polyglot.Interactive;\nvar kernel = Kernel.Root.FindKernelByName(\"multiplechoice\") as MultipleChoiceKernel;\nkernel.Options = new HashSet<string> { \"1\", \"2\" };\n",
        `KernelInvocationContext.Current.DisplayAs(${multipleChoiceWidget()},"text/html");`
      ],
      challengeContent: [
        {
          type: "multiplechoice",
          content: "",
          priority: 1
        },
        // {
        //     type: "html",
        //     content: multipleChoiceWidget(),
        //     priority: 0
        // }
      ]
    },
    reactFlow: {},
    data: {} 
  }
}

// Experimental
export const finishNode = () : PolyglotNode => {
  return {
    type: "multipleChoiceNode",
    _id: "1",
    title: "Domanda",
    description: "descriptiom",
    difficulty: 1,
    runtimeData: {
      challengeSetup: [
        "\nusing Polyglot.Interactive;\nvar kernel = Kernel.Root.FindKernelByName(\"multiplechoice\") as MultipleChoiceKernel;\nkernel.Options = new HashSet<string> { \"1\", \"2\" };\n",
        `KernelInvocationContext.Current.DisplayAs(${multipleChoiceWidget()},"text/html");`
      ],
      challengeContent: [
        {
          type: "multiplechoice",
          content: "",
          priority: 1
        },
        // {
        //     type: "html",
        //     content: multipleChoiceWidget(),
        //     priority: 0
        // }
      ]
    },
    reactFlow: {},
    data: {} 
  }
}