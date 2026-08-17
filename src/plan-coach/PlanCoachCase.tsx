import { publicUrl } from '../publicUrl'
import { planCoachCopy } from './copy'
import './plan-coach.css'

export default function PlanCoachCase() {
  const liveSrc = publicUrl('coach/')

  return (
    <div className="pc-page">
      <header className="pc-top">
        <a className="pc-top__back" href={publicUrl('')}>
          ← Portfolio
        </a>
        <span className="pc-top__mark">@Sifan Pan</span>
      </header>

      <section className="pc-hero">
        <p className="pc-hero__index">{planCoachCopy.index} {planCoachCopy.kicker}</p>
        <h1>{planCoachCopy.title}</h1>
        <p className="pc-hero__lede">{planCoachCopy.lede}</p>
      </section>

      <div className="pc-layout">
        <div>
          <dl className="pc-dl">
            <div>
              <dt>Goal</dt>
              <dd>{planCoachCopy.goal}</dd>
            </div>
            <div>
              <dt>Action</dt>
              <dd>{planCoachCopy.action}</dd>
            </div>
            <div>
              <dt>Result</dt>
              <dd>{planCoachCopy.result}</dd>
            </div>
          </dl>
          <p className="pc-path">
            <strong>Try the demo</strong>
            {planCoachCopy.demoPath}
          </p>
        </div>

        <div className="pc-phone">
          <iframe
            title="Plan Coach live prototype"
            src={liveSrc}
            allow="fullscreen"
          />
        </div>
      </div>
    </div>
  )
}
