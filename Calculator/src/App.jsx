import { useReducer } from "react";
import "./App.css";
import DigitButton from "./components/DigitButton";
import OperationButton from "./components/OperationButton";
import { motion } from "framer-motion";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  REMOVE_DIGIT: "digit-removed",
  CLEAR: "clear",
  CHOOSE_OPERATION: "choose-operation",
  EVALUATE: "evaluate",
};

const initialState = {
  currentOperand: null,
  previousOperand: null,
  operation: null,
  onePluse: false,
};

const INTEGER_FORMATTER = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

function numberFormater(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (payload.digit === "." && state.currentOperand?.includes(".")) {
        return state;
      }
      if (state.overWrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overWrite: false,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
        onePluse: false,
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.REMOVE_DIGIT:
      if (state.currentOperand == null) return state;
      if (state.overWrite) {
        return {
          ...state,
          overWrite: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand.length == 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }
      return {
        ...state,
        currentOperand: `${state?.currentOperand?.slice(0, -1)}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          currentOperand: null,
          previousOperand: state?.currentOperand,
          operation: payload?.operation,
        };
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload?.operation,
        };
      }
      return {
        ...state,
        previousOperand: String(evaluate(state)),
        operation: payload.operation,
        currentOperand: null,
      };
    case ACTIONS.EVALUATE:
      if (state.onePluse) {
        return {
          ...state,
          previousOperand: null,
          operation: null,
          currentOperand: null,
          onePluse: false,
        };
      }
      if (
        state.previousOperand == "1" &&
        state.currentOperand == null &&
        state.operation == "+"
      ) {
        return {
          ...state,
          previousOperand: null,
          operation: null,
          currentOperand: null,
          onePluse: true,
        };
      }
      if (
        state.currentOperand == null ||
        state.previousOperand == null ||
        state.operation == null
      ) {
        // console.log(state);
        return state;
      }

      return {
        ...state,
        previousOperand: null,
        operation: null,
        overWrite: true,
        currentOperand: String(evaluate(state)),
      };

    default:
      return state;
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;
    default:
      computation = "";
  }
  return computation;
}

function App() {
  const [{ currentOperand, previousOperand, operation, onePluse }, dispatch] =
    useReducer(reducer, { initialState });
  // console.log(initialState);
  return (
    <div className="app__container">
      <div className="cal__grid">
        <div className="output">
          <motion.div
            style={{
              visibility: onePluse ? "visible" : "hidden",
              color: "white",
            }}
            initial={{ width: "0%", height: "0.1rem" }}
            animate={
              onePluse
                ? { width: "95%", height: "var(--responsive-height)" }
                : { width: "0%", height: "0.1rem" }
            }
            transition={{
              width: { duration: 1, ease: "easeOut" },
              height: { delay: 1, duration: 1, ease: "easeOut" },
            }}
            className="output-absolute"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={onePluse ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
              transition={{
                delay: 2, // Starts after the div animation finishes
                duration: 0.5,
                ease: "easeOut",
              }}
              className="text"
            >
              Never
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={onePluse ? { opacity: 1, y: -20 } : { opacity: 0, y: 20 }}
              transition={{
                delay: 2, // Starts after the div animation finishes
                duration: 0.5,
                ease: "easeOut",
              }}
              className="text"
            >
              Settle
            </motion.div>
          </motion.div>

          <div className="previous__operand">
            {numberFormater(previousOperand)} {operation}
          </div>
          <div className="current__operand">
            {numberFormater(currentOperand)}
          </div>
        </div>
        <button
          onClick={() => dispatch({ type: ACTIONS.CLEAR })}
          className="btn span__two"
        >
          AC
        </button>
        <button
          onClick={() => dispatch({ type: ACTIONS.REMOVE_DIGIT })}
          className="btn"
        >
          DEL
        </button>
        <OperationButton operation="÷" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperationButton operation="*" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperationButton operation="-" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperationButton operation="+" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <button
          onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
          className="equal btn span__two"
        >
          =
        </button>
      </div>
    </div>
  );
}

export default App;
