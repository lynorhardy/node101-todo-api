const express = require("express");
    
    const app = express();
    const PORT = 8484;
    
    app.use(express.json());

    let todoItems = [
        { todoItemId: 0, name: "an item", priority: 3, completed: false },
        { todoItemId: 1, name: "another item", priority: 2, completed: false },
        { todoItemId: 2, name: "a done item", priority: 1, completed: true }    
    ];

    function findTodoById(id) {
        return todoItems.find((T) => T.todoItemId === id);
    }

    app.get("/", (req, res) => {
        res.status(200).json({ status: "ok" });
    });

    app.get("/api/TodoItems", (req, res) => {
        res.status(200).json(todoItems);
    });

    app.get("/api/TodoItems/:number", (req, res) => {
        const id = Number(req.params.number);
        const item = findTodoById(id);

        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }

        res.status(200).json(item);
    });

    app.post("/api/TodoItems", (req, res) => {
        const { todoItemId, name, priority, completed } = req.body;

        if (
                typeof todoItemId !== "number" ||
                typeof name !== "string" ||
                typeof priority !== "number" ||
                typeof completed !== "boolean"
            ) {
            return res.status(400).json({ error: "Invalid todo item payload" });
        }
        
        if (findTodoById(todoItemId)) {
            return res.status(409).json({ error: "Item with this ID already exists" });
        }

        const newItem = { todoItemId, name, priority, completed };
        todoItems.push(newItem);
        res.status(201).json(newItem);
    });

    app.delete("/api/TodoItems/:number", (req, res) => {
        const id = Number(req.params.number);
        const index = todoItems.findIndex((t) => t.todoItemId === id);

        if (index === -1) {
            return res.status(404).json({ error: "Item not found" });
        }

        const deletedItem = todoItems.splice(index, 1)[0];
        res.status(200).json(deletedItem);
    });

    app.listen(8484, () => {
        console.log(`API server running at http://localhost:8484`);
    });