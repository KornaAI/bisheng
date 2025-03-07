// 嵌iframe、适配移动端
import { useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { generateUUID } from "../../utils";
import ChatPanne from "./components/ChatPanne";
import { AppNumType } from "@/types/app";

export default function chatShare({ type = AppNumType.SKILL }) {
    const { id: flowId } = useParams()
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const libId = searchParams.get('lib')
    const tweak = searchParams.get('tweak')

    const wsUrl = useMemo(() => {
        if (type === AppNumType.FLOW) return `/api/v2/workflow/chat/${flowId}?`

        const params = [];

        if (libId) params.push(`knowledge_id=${libId}`);
        if (tweak) params.push(`tweak=${encodeURIComponent(tweak)}`);

        const paramStr = params.length > 0 ? `${params.join('&')}` : '';

        return `/api/v2/chat/ws/${flowId}?type=L1&${paramStr}`
    }, [libId, tweak, type])

    const [data] = useState<any>({ id: flowId, chatId: generateUUID(32), type })

    if (!flowId) return <div>请选择会话</div>

    return <ChatPanne customWsHost={wsUrl} version="v2" data={data} />
};
