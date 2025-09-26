/**
 * Next.js App Router API Proxy Route
 * Proxies requests to the backend to avoid CORS issues
 */

import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'http://localhost:3000'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params, 'GET')
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params, 'POST')
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params, 'PUT')
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params, 'DELETE')
}

export async function OPTIONS(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  // Handle preflight requests
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

async function handleRequest(
  request: NextRequest,
  params: { path: string[] },
  method: string
) {
  try {
    // Extract the path from the dynamic route
    const apiPath = params.path.join('/')
    const targetUrl = `${BACKEND_URL}/${apiPath}`

    console.log(`Proxying ${method} request to: ${targetUrl}`)

    // Get request body for non-GET requests
    let body: string | undefined
    if (method !== 'GET' && method !== 'HEAD') {
      try {
        const requestBody = await request.json()
        body = JSON.stringify(requestBody)
        console.log('Request body:', requestBody)
      } catch {
        // If no JSON body, that's fine
      }
    }

    // Forward the request to the backend
    const response = await fetch(targetUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Forward authorization header if present
        ...(request.headers.get('authorization') && { 
          'Authorization': request.headers.get('authorization')! 
        }),
      },
      body,
    })

    console.log(`Backend response status: ${response.status}`)

    // Get response text
    const responseText = await response.text()
    console.log(`Backend response body: ${responseText}`)

    // Try to parse as JSON
    let responseData
    try {
      responseData = JSON.parse(responseText)
    } catch {
      responseData = { message: responseText, success: response.ok }
    }

    // Return response with CORS headers
    return NextResponse.json(responseData, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error) {
    console.error('Proxy error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Proxy server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    )
  }
}