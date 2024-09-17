import { Suspense } from "react";
import Loader from "../Loader/Loader";
import PropTypes from "prop-types";

const SuspenseWrapper = ({ children }) => {
  return <Suspense fallback={<Loader />}>{children}</Suspense>;
};

SuspenseWrapper.propTypes = {
  children: PropTypes.node,
};

SuspenseWrapper.defaultProps = {
  children: null,
};

export default SuspenseWrapper;
