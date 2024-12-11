"use client"

import { useParams } from 'next/navigation'

const Page = () => {

    const { id } = useParams();

    return (
        <div>Page {id}</div>
    )
}

export default Page