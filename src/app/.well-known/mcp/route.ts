import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    "$schema": "https://modelcontextprotocol.io/schema/mcp-manifest.json",
    "name": "palaz-strategy-company",
    "description": "Official Model Context Protocol (MCP) Server for Palaz Strategy Company (Palaz Design Studio)",
    "version": "1.0.0",
    "status": "online",
    "transport": {
      "type": "streamable-http",
      "endpoint": "https://palazstrategy.vercel.app/api/mcp"
    },
    "capabilities": {
      "tools": true,
      "resources": true
    },
    "tools": [
      {
        "name": "get_studio_info",
        "description": "Returns verified studio capabilities, services, methodology, legal entity, and contact channels for Palaz Strategy Company (Palaz Design Studio)."
      },
      {
        "name": "list_portfolio_cases",
        "description": "Returns the curated list of published client cases with slugs, years, roles, and categories."
      },
      {
        "name": "get_case_details",
        "description": "Retrieves complete project details, narrative, and assets for a specific case by its slug."
      },
      {
        "name": "submit_project_inquiry",
        "description": "Submits a client inquiry or strategic discovery call request directly to the Palaz creative team."
      }
    ]
  }, {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
    }
  });
}
