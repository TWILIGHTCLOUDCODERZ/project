# Deployment Guide — TCC RAPTOR → Google Cloud Run

End-to-end steps to ship this Vite SPA to **Cloud Run** with a **GitHub → Cloud Build** CI/CD pipeline and the Gemini key stored in **Google Secret Manager**.

## Fixed settings for this project

| Setting | Value |
|---|---|
| GCP project | `deepan-gemini-xprize` |
| Region | `asia-south1` (Mumbai) |
| Cloud Run service | `tcc-raptor-retail` |
| Artifact Registry repo | `cloud-run-source-deploy` |
| Secret name | `VITE_GEMINI_API_KEY` |
| Deployer service account | `cloudbuild-deployer` |

---

## The pipeline

```
git push (main)
      │
      ▼
GitHub repo ──▶ Cloud Build trigger ──▶ cloudbuild.yaml:
                                         1. read VITE_GEMINI_API_KEY from Secret Manager
                                         2. docker build  (Vite inlines the key)
                                         3. push image → Artifact Registry
                                         4. gcloud run deploy → Cloud Run
      │
      ▼
Live HTTPS URL (https://tcc-raptor-retail-….a.run.app)
```

---

## ⚠️ How secrets work here — read this first

This app is a **static Single-Page App**. At runtime it is just HTML/CSS/JS served by Nginx — **there is no server process** to read environment variables. Vite therefore **inlines** every `VITE_*` variable into the JavaScript bundle **at build time**.

Consequences:

- **Secret Manager is used at BUILD time**, not runtime. Cloud Build reads the secret and passes it to `docker build` as a build-arg; Vite bakes it into the bundle. (Cloud Run runtime `--set-secrets` would do nothing for a static site.)
- **The key ends up visible in the shipped JavaScript.** Anyone using the site can read it in DevTools. This is unavoidable for *any* client-side key — Secret Manager keeps it out of your git history and centralizes rotation, but it cannot hide a client-side value.
- **Therefore: restrict the key** (Step 9). The real protection is an API-key restriction, not secrecy.
- The only truly private fix is a backend proxy that holds the key and calls Gemini server-side — out of scope for this static deploy.

---

## Prerequisites (already installed on this machine)

| Tool | Verify |
|---|---|
| Google Cloud CLI | `gcloud --version` |
| Git | `git --version` |
| GitHub CLI | `gh --version` |

You also need: a **Google account** with access to project `deepan-gemini-xprize`, **billing enabled** on that project, and a **GitHub account**.

---

## Step 0 — Authenticate & select the project

```bash
gcloud auth login
gcloud config set project deepan-gemini-xprize
gcloud auth list          # confirms the active account
gcloud config list        # confirms project = deepan-gemini-xprize
```

`gcloud auth login` opens a browser for Google sign-in. This is the one step that must be done interactively.

---

## Step 1 — Confirm billing & enable APIs

Cloud Run and Cloud Build require billing on the project.

```bash
# Should print: billingEnabled: true
gcloud billing projects describe deepan-gemini-xprize

# Enable the four APIs the pipeline needs
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com
```

If billing is **not** enabled, open the [Billing console](https://console.cloud.google.com/billing), link a billing account to `deepan-gemini-xprize`, then re-run the enable command.

---

## Step 2 — Store the Gemini key in Secret Manager

The value comes from your local `project/.env` (`VITE_GEMINI_API_KEY=…`). Create the secret without ever printing the value:

```bash
# Run from the project/ folder. Uses Git Bash / bash.
grep '^VITE_GEMINI_API_KEY=' .env | cut -d= -f2- | tr -d '\r\n' | \
  gcloud secrets create VITE_GEMINI_API_KEY \
    --replication-policy=automatic \
    --data-file=-
```

To rotate the key later, add a new version (the pipeline always reads `:latest`):

```bash
printf '%s' "NEW_KEY_VALUE" | gcloud secrets versions add VITE_GEMINI_API_KEY --data-file=-
```

Verify:

```bash
gcloud secrets versions list VITE_GEMINI_API_KEY
```

---

## Step 3 — Create the Artifact Registry repo

Holds the built container images.

```bash
gcloud artifacts repositories create cloud-run-source-deploy \
  --repository-format=docker \
  --location=asia-south1 \
  --description="TCC RAPTOR container images"
```

---

## Step 4 — Create a deployer service account & grant roles

The Cloud Build trigger runs as this identity. A dedicated SA makes permissions explicit and works regardless of project defaults.

```bash
# Create the service account
gcloud iam service-accounts create cloudbuild-deployer \
  --display-name="Cloud Build deployer for TCC RAPTOR"
```

Grant the five roles it needs (build logs, push image, read secret, deploy, act-as runtime SA):

```bash
gcloud projects add-iam-policy-binding deepan-gemini-xprize \
  --member="serviceAccount:cloudbuild-deployer@deepan-gemini-xprize.iam.gserviceaccount.com" \
  --role="roles/logging.logWriter"

gcloud projects add-iam-policy-binding deepan-gemini-xprize \
  --member="serviceAccount:cloudbuild-deployer@deepan-gemini-xprize.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding deepan-gemini-xprize \
  --member="serviceAccount:cloudbuild-deployer@deepan-gemini-xprize.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud projects add-iam-policy-binding deepan-gemini-xprize \
  --member="serviceAccount:cloudbuild-deployer@deepan-gemini-xprize.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding deepan-gemini-xprize \
  --member="serviceAccount:cloudbuild-deployer@deepan-gemini-xprize.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
```

---

## Step 5 — Put the code in Git and push to GitHub

From the `project/` folder:

```bash
git init -b main
git add .
git commit -m "TCC RAPTOR retail platform — Cloud Run deploy setup"
```

`.gitignore` already excludes `.env`, so your key is **not** committed. Create the GitHub repo and push with the GitHub CLI:

```bash
gh auth login        # interactive, one-time
gh repo create tcc-raptor-retail --private --source=. --remote=origin --push
```

(`--private` recommended; use `--public` if you want it open. Change the repo name if you prefer.)

---

## Step 6 — Connect the GitHub repo to Cloud Build (interactive, one-time)

Cloud Build needs permission to read the repo. This uses the **Cloud Build GitHub App** and must be authorized in the browser:

1. Open the [Cloud Build Triggers page](https://console.cloud.google.com/cloud-build/triggers?project=deepan-gemini-xprize) and set the region to **asia-south1** (top of page).
2. Click **Connect Repository**.
3. Source: **GitHub (Cloud Build GitHub App)** → **Continue** → authenticate to GitHub.
4. Install/authorize the app on your account and select the **`tcc-raptor-retail`** repository.
5. Tick the consent box and **Connect**. Stop before "Create a trigger" — the next step creates it via CLI.

---

## Step 7 — Create the Cloud Build trigger

```bash
gcloud builds triggers create github \
  --name=deploy-tcc-raptor \
  --region=asia-south1 \
  --repo-owner=YOUR_GITHUB_USERNAME \
  --repo-name=tcc-raptor-retail \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml \
  --service-account="projects/deepan-gemini-xprize/serviceAccounts/cloudbuild-deployer@deepan-gemini-xprize.iam.gserviceaccount.com"
```

Replace `YOUR_GITHUB_USERNAME` with your GitHub account/org name.

---

## Step 8 — Deploy (first build) & get the URL

Trigger a build by pushing (or run it on demand):

```bash
# Option A — push a commit to main (normal workflow)
git commit --allow-empty -m "trigger first deploy" && git push origin main

# Option B — run the trigger immediately, no commit needed
gcloud builds triggers run deploy-tcc-raptor --branch=main --region=asia-south1
```

Watch progress:

```bash
gcloud builds list --region=asia-south1 --limit=1
# stream logs for the running build:
gcloud builds log --region=asia-south1 $(gcloud builds list --region=asia-south1 --ongoing --format='value(id)' --limit=1) --stream
```

When it finishes, print the live URL:

```bash
gcloud run services describe tcc-raptor-retail \
  --region=asia-south1 --format='value(status.url)'
```

From now on, **every push to `main` auto-builds and redeploys**. That's the full git → Cloud Run loop.

---

## Step 9 — Harden the Gemini key (post-deploy)

Because the key is in the client bundle, restrict it so it only works from your site:

1. Open [Google AI Studio → API keys](https://aistudio.google.com/app/apikey) (or **APIs & Services → Credentials** in Cloud Console).
2. Edit the key → **Application restrictions → Websites (HTTP referrers)**.
3. Add your Cloud Run URL (and any custom domain), e.g. `https://tcc-raptor-retail-*.run.app/*`.
4. Under **API restrictions**, limit it to the Generative Language API.

Rotate the key (Step 2) and redeploy if it was ever exposed unrestricted.

---

## Everyday operations

```bash
# Logs
gcloud run services logs read tcc-raptor-retail --region=asia-south1 --limit=50

# Roll back to a previous revision
gcloud run revisions list --service=tcc-raptor-retail --region=asia-south1
gcloud run services update-traffic tcc-raptor-retail --region=asia-south1 --to-revisions=REVISION_NAME=100

# Manual redeploy without GitHub (from project/)
gcloud builds submit --config cloudbuild.yaml
```

---

## Troubleshooting

| Symptom | Cause & fix |
|---|---|
| Build fails: `PERMISSION_DENIED` on secret | Deployer SA missing `secretmanager.secretAccessor` (Step 4), or secret name mismatch. |
| Build fails pushing image | Missing `artifactregistry.writer`, or the AR repo/region doesn't exist (Step 3). |
| Deploy step fails: cannot act as runtime SA | Missing `iam.serviceAccountUser` (Step 4). |
| Virtual Try-On does nothing in prod | Secret empty/unset at build time — check `gcloud secrets versions list VITE_GEMINI_API_KEY` and rebuild. |
| Blank page / 404 on refresh | SPA fallback — handled by `nginx.conf` `try_files … /index.html`; ensure the image rebuilt. |
| Trigger never fires | GitHub app not connected (Step 6) or branch pattern ≠ `main`. |

---

## What's in the repo

| File | Role |
|---|---|
| `Dockerfile` | Multi-stage: Node builds the SPA (accepts `VITE_GEMINI_API_KEY` build-arg) → Nginx serves `dist/` on port 8080. |
| `nginx.conf` | Static serving, gzip, immutable asset caching, SPA fallback, security headers. |
| `cloudbuild.yaml` | CI/CD pipeline: read secret → build → push → deploy. |
| `.dockerignore` | Keeps `node_modules`, `dist`, `.env` out of the image. |
| `.gcloudignore` | Keeps the Cloud Build upload small; excludes `.env`. |

---

## Cleanup (to stop all charges)

```bash
gcloud run services delete tcc-raptor-retail --region=asia-south1 --quiet
gcloud builds triggers delete deploy-tcc-raptor --region=asia-south1 --quiet
gcloud artifacts repositories delete cloud-run-source-deploy --location=asia-south1 --quiet
gcloud secrets delete VITE_GEMINI_API_KEY --quiet
```
