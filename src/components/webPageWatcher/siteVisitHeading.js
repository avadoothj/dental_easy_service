import { formatNumber } from '@/utils/utils'
import React from 'react'

export default function SiteVisitHeading({counts}) {
  return (
    <div className="commonHeading">
        <h1>Site Visit List <span>({formatNumber(counts.totalUrl)})</span></h1>
    </div>
  )
}
