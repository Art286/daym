const fs = require("fs");
const path = require("path");

const QUIZ_FILE = path.join(__dirname, "quizzes.json");

// Create the quiz file if it doesn't exist
if (!fs.existsSync(QUIZ_FILE)) {
    fs.writeFileSync(QUIZ_FILE, JSON.stringify([]));
}

module.exports = {
    name: "quiz",
    version: "1.0.0",
    description: "Quiz system for admins and users",
    author: "joshuaApostol",
    async execute({ api, event, args }) {
        try {
            const { threadID, senderID } = event;

            let quizzes = JSON.parse(fs.readFileSync(QUIZ_FILE));

            if (args.length === 0) {
                return api.sendMessage("❓ Available commands:\n\n📌 Admin:\n- quiz add <question> | <answer>\n- quiz list\n- quiz remove <index>\n\n📌 User:\n- quiz <answer>", threadID);
            }

            const command = args[0].toLowerCase();

            // ✅ GET ADMIN LIST
            const threadInfo = await api.getThreadInfo(threadID);
            const admins = threadInfo.adminIDs.map(admin => admin.id);

            // ✅ CHECK IF ADMIN
            const isAdmin = admins.includes(senderID);

            // ✅ ADD QUIZ (Admin Only)
            if (command === "add") {
                if (!isAdmin) return api.sendMessage("⛔ Only admins can add quizzes.", threadID);
                if (args.length < 2) return api.sendMessage("❌ Correct format: quiz add <question> | <answer>", threadID);

                const input = args.slice(1).join(" ");
                const [question, answer] = input.split(" | ");

                if (!question || !answer) return api.sendMessage("❌ Invalid format! Use: quiz add <question> | <answer>", threadID);

                quizzes.push({ question, answer: answer.toLowerCase() });
                fs.writeFileSync(QUIZ_FILE, JSON.stringify(quizzes, null, 2));

                return api.sendMessage(`✅ Quiz added:\n📌 ${question}\n✏️ Answer: ${answer}`, threadID);
            }

            // ✅ LIST QUIZZES
            if (command === "list") {
                if (quizzes.length === 0) return api.sendMessage("❌ No active quizzes.", threadID);

                const quizList = quizzes.map((q, index) => `${index + 1}. 📌 ${q.question}`).join("\n");
                return api.sendMessage(`📋 Quiz List:\n\n${quizList}`, threadID);
            }

            // ✅ REMOVE QUIZ (Admin Only)
            if (command === "remove") {
                if (!isAdmin) return api.sendMessage("⛔ Only admins can remove quizzes.", threadID);
                if (args.length < 2) return api.sendMessage("❌ Correct format: quiz remove <index>", threadID);

                const index = parseInt(args[1]) - 1;
                if (isNaN(index) || index < 0 || index >= quizzes.length) return api.sendMessage("❌ Invalid index!", threadID);

                const removed = quizzes.splice(index, 1)[0];
                fs.writeFileSync(QUIZ_FILE, JSON.stringify(quizzes, null, 2));

                return api.sendMessage(`🗑️ Removed quiz: 📌 ${removed.question}`, threadID);
            }

            // ✅ USER ANSWERS QUIZ
            const userAnswer = args.join(" ").toLowerCase();
            const foundQuiz = quizzes.find(q => q.answer === userAnswer);

            if (foundQuiz) {
                return api.sendMessage(`🎉 Correct! ✅ The answer to "${foundQuiz.question}" is "${foundQuiz.answer}"`, threadID);
            } else {
                return api.sendMessage("❌ Wrong answer! Try again.", threadID);
            }

        } catch (err) {
            console.error(err);
            api.sendMessage("❌ An error occurred in the quiz system.", event.threadID);
        }
    }
};
