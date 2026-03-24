'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Service = {
  id: string
  name: string
  url: string | null
  safety_score: number | null
  real_nationality: string | null
  memo: string | null
  created_at: string
}

export default function Home() {
  const [services, setServices] = useState<Service[]>([])
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [score, setScore] = useState('')
  const [nationality, setNationality] = useState('')
  const [memo, setMemo] = useState('')

  // データ読み込み
  async function loadServices() {
    const { data } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setServices(data)
  }

  // 初回読み込み
  useEffect(() => {
    loadServices()
  }, [])

  // 登録処理
  async function handleSubmit() {
    if (!name) return
    await supabase.from('services').insert({
      name,
      url: url || null,
      safety_score: score ? parseInt(score) : null,
      real_nationality: nationality || null,
      memo: memo || null,
    })
    setName('')
    setUrl('')
    setScore('')
    setNationality('')
    setMemo('')
    loadServices()
  }

  return (
    <main style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <h1>🛡️ AIサービス安全性ミニディレクトリ v2</h1>

      {/* 登録フォーム */}
      <div style={{ marginBottom: 30, padding: 20, border: '1px solid #ccc' }}>
        <h2>サービス登録</h2>
        <div style={{ marginBottom: 10 }}>
          <input placeholder="サービス名（必須）" value={name}
            onChange={e => setName(e.target.value)}
            style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <input placeholder="URL" value={url}
            onChange={e => setUrl(e.target.value)}
            style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <select value={score} onChange={e => setScore(e.target.value)}
            style={{ padding: 8 }}>
            <option value="">安全性スコア</option>
            {[1,2,3,4,5].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 10 }}>
          <input placeholder="実質国籍" value={nationality}
            onChange={e => setNationality(e.target.value)}
            style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <input placeholder="メモ" value={memo}
            onChange={e => setMemo(e.target.value)}
            style={{ width: '100%', padding: 8 }} />
        </div>
        <button onClick={handleSubmit} style={{ padding: '8px 20px' }}>
          登録
        </button>
      </div>

      {/* 一覧表示 */}
      <h2>登録済みサービス（{services.length}件）</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #333' }}>
            <th style={{ textAlign: 'left', padding: 8 }}>名前</th>
            <th style={{ textAlign: 'left', padding: 8 }}>URL</th>
            <th style={{ textAlign: 'center', padding: 8 }}>安全性</th>
            <th style={{ textAlign: 'left', padding: 8 }}>実質国籍</th>
            <th style={{ textAlign: 'left', padding: 8 }}>メモ</th>
          </tr>
        </thead>
        <tbody>
          {services.map(s => (
            <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 8 }}>{s.name}</td>
              <td style={{ padding: 8 }}>
                {s.url && <a href={s.url} target="_blank">{s.url}</a>}
              </td>
              <td style={{ textAlign: 'center', padding: 8 }}>{s.safety_score}</td>
              <td style={{ padding: 8 }}>{s.real_nationality}</td>
              <td style={{ padding: 8 }}>{s.memo}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <footer style={{ marginTop: 40, padding: 20, borderTop: '1px solid #ccc', color: '#888', fontSize: 14 }}>
        AIサービス安全性ミニディレクトリ — 練習プロジェクト
      </footer>
    </main>
  )
}