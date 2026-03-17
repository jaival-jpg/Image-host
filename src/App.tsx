/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import { Layout } from "./components/layout/Layout"
import { Home } from "./pages/Home"
import { Host } from "./pages/Host"
import { History } from "./pages/History"
import { About } from "./pages/About"

function AnimatedRoutes() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <Routes location={location}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="host" element={<Host />} />
            <Route path="history" element={<History />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}
