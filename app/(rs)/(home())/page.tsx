// export const metadata = {
// 	title: "Home",
// }

import { redirect } from "next/navigation"


const HomePage = () => {
	redirect('/tickets')
}

export default HomePage