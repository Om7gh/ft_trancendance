import { BarLoader } from "react-spinners";
import { Placeholder } from "@/utils/JsxByStatus.tsx";
import ErrorImg from "@assets/illustrations/error.svg";

interface ResolverProps{
    children: React.ReactNode;
    state: "connected" | "closed" | "failed" | "connecting";
}

function ConnectionResolver({state, children}: ResolverProps){
	switch (state){
		case "connecting":{
			return (
				<Placeholder
					primaryMsg="Establishing connection"
					secondaryMsg="Please wait...">
					<BarLoader
						color="#22d3eecc"
						height={3}
						width={200}
						cssOverride={{ margin: "15px", borderRadius: "10px"}}/>
				</Placeholder>
			)
		}
		case "closed":{
			return (
				<Placeholder
					imgUrl={ErrorImg}
					primaryMsg="This session has ended"
					secondaryMsg="Another login or tab may have replaced this session">
				</Placeholder>
			)
		}
		case "failed":{
			return (
				<Placeholder
					imgUrl={ErrorImg}
					primaryMsg="Temporary connection problem"
					secondaryMsg="Reconnecting may resolve this">
				</Placeholder>
			)
		}
		case "connected":{
			return <>{children}</>;
		}
	}
}


export default ConnectionResolver;