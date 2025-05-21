import { PDFProvider } from './PDFContext'
import Header from "./Header"
import Footer from "./Footer"
const Provider = ({ children }) => {
  return (
    <PDFProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        {children}
        <Footer />
      </div>
    </PDFProvider>
  )
}

export default Provider