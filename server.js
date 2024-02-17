import express from "express";
import dotenv from "dotenv";
import stripe from "stripe";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.sendFile("main.html", { root: "public" });
});

// Success route
app.get("/success", (req, res) => {
    res.sendFile("success.html", { root: "public" });
});

// Cancel route
app.get("/cancel", (req, res) => {
    res.sendFile("cancel.html", { root: "./public" });
});

// Initialize Stripe with your API key
let stripeGateway = stripe(process.env.stripe_api);
let DOMAIN = process.env.DOMAIN;

app.post("/stripe-checkout", async (req, res) => {
    try {
        const items = req.body.items;

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ error: "Invalid request body" });
        }

        // Calculate the total amount of the line items
        const totalAmountCents = items.reduce(
            (total, item) => {
                const unitAmount = parseInt(item.price.replace(/[^0-9.-]+/g, "")) * 1000;
                return total + unitAmount * item.quantity;
            },
            0
        );

        // Check if the total amount exceeds the maximum allowed amount
        if (totalAmountCents > 10000000) {
            return res.status(400).json({
                error: "Total amount exceeds $10,000.00",
            });
        }

        const lineItems = items.map((item) => {
            const unitAmount = parseInt(item.price.replace(/[^0-9.-]+/g, "")) * 100;

            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.title,
                        images: [item.productImg],
                    },
                    unit_amount: unitAmount,
                },
                quantity: item.quantity,
            };
        });

        // Create a Stripe Checkout session
        const session = await stripeGateway.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: `${DOMAIN}/success`,
            cancel_url: `${DOMAIN}/cancel`,
            line_items: lineItems,
            billing_address_collection: "required",
            // Specify any other session options as needed
        });

        res.json(session.url);
    } catch (error) {
        console.error("Stripe Error:", error.message);
        res.status(500).json({ error: "An error occurred" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
