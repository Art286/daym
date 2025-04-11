const fs = require("fs");
const path = require("path");

const quizFile = path.join(__dirname, "quiz.json");

// Load quiz data or create an empty file
const loadQuizzes = () => {
    if (!fs.existsSync(quizFile)) {
        fs.writeFileSync(quizFile, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(quizFile));
};

// Save quiz data
const saveQuizzes = (data) => {
    fs.writeFileSync(quizFile, JSON.stringify(data, null, 2));
};

module.exports = {
    name: "quiz",
    description: "Admin can add quizzes, and users can answer them.",
    nashPrefix: false,
    version: "1.0.0",
    cooldowns: 5,
    aliases: ["q"],
    usage: "[add <question> | <answer>] / [<quizID> <answer>]",
    example: "quiz add What is 2+2? | 4",
    category: "Fun",
    execute: async (api, args, prefix) => {
        const { threadID, messageID, senderID } = cmd;
        let quizzes = loadQuizzes();

        if (args[0] === "add") {
            const adminID = "100066742490781"; // Palitan ng iyong Facebook ID
            if (senderID !== adminID) {
                return api.sendMessage("Only the admin can add quizzes!", threadID, messageID);
            }

            args.shift();
            const quizData = args.join(" ").split("|").map(q => q.trim());
            if (quizData.length !== 2) {
                return api.sendMessage(`Incorrect format. Example:\n${prefix}quiz add What is 2+2? | 4`, threadID, messageID);
            }

            const [question, answer] = quizData;
            quizzes.push({ id: quizzes.length + 1, question, answer });

            saveQuizzes(quizzes);
            return api.sendMessage(`Quiz added!\n\nID: ${quizzes.length}\nQuestion: ${question}`, threadID, messageID);
        }

        if (args.length < 2) {
            return api.sendMessage(`Usage:\n- ${prefix}quiz add <question> | <answer> (Admin Only)\n- ${prefix}quiz <quizID> <answer> (Answer a quiz)`, threadID, messageID);
        }

        const quizID = parseInt(args[0]);
        const userAnswer = args.slice(1).join(" ");

        const quiz = quizzes.find(q => q.id === quizID);
        if (!quiz) {
            return api.sendMessage("Quiz not found!", threadID, messageID);
        }

        if (quiz.answer.toLowerCase() === userAnswer.toLowerCase()) {
            return api.sendMessage(`✅ Correct! 🎉`, threadID, messageID);
        } else {
            return api.sendMessage(`❌ Wrong answer. Try again!`, threadID, messageID);
        }
    },
};