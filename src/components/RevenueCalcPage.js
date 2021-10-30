import { Form } from "react-bootstrap";
import { useState } from "react";
function RevenueCalcPage() {
    const [reviewCount, setReviewCount] = useState(12);
    const [price, setPrice] = useState(10.50);
    return (
        <div className="revenueCalcPage">
            <div>
                <h3>Calculate Revenue from Steam Games</h3>
                <h4>Using the Boxleiter method we can use the number of review a game has on Steam to estimate the number of owners. From this, we can calculate the gross revenue and by adjusting for discounts, regional pricing, etc. we can get a rough idea of the net revenue.</h4>
            </div>
            <div className="revenueCalcInput">
                <Form>
                    <div>
                        <Form.Label>REVIEW COUNT</Form.Label>
                        <Form.Control value={reviewCount} onChange={e => setReviewCount(e.target.value)} type="number"></Form.Control>
                    </div>
                    <div>
                        <Form.Label>PRICE (USD)</Form.Label>
                        <Form.Control value={price} onChange={e => setPrice(e.target.value)} type="number"></Form.Control>
                    </div>
                </Form>
            </div>
            <div className="revenueCalcResult">
                <h1>${Math.round(reviewCount * price * 60 * 100) / 100}</h1>
                <h5>TOTAL REVENUE</h5>
            </div>
        </div>
    );
}

export default RevenueCalcPage;