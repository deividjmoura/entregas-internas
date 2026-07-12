terraform {
  required_version = ">= 1.7.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.30"
    }
  }
}

variable "gcp_project_id" {
  description = "ID do projeto GCP (preencher no terraform.tfvars, não commitar)"
  type        = string
}

variable "gcp_region" {
  description = "Região padrão"
  type        = string
  default     = "southamerica-east1"
}

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

# ---- APIs necessárias ----
resource "google_project_service" "apis" {
  for_each = toset([
    "run.googleapis.com",
    "sqladmin.googleapis.com",
    "firestore.googleapis.com",
    "redis.googleapis.com",
    "pubsub.googleapis.com",
    "cloudbuild.googleapis.com",
    "artifactregistry.googleapis.com",
    "aiplatform.googleapis.com",
    "firebase.googleapis.com",
    "logging.googleapis.com",
    "monitoring.googleapis.com",
    "cloudtrace.googleapis.com",
  ])
  service            = each.key
  disable_on_destroy = false
}

# ---- Artifact Registry (imagens Docker dos microserviços) ----
resource "google_artifact_registry_repository" "docker_repo" {
  location      = var.gcp_region
  repository_id = "entregas-internas"
  format        = "DOCKER"
  depends_on    = [google_project_service.apis]
}

# ---- VPC dedicada ----
resource "google_compute_network" "vpc" {
  name                    = "entregas-internas-vpc"
  auto_create_subnetworks = false
  depends_on              = [google_project_service.apis]
}

resource "google_compute_subnetwork" "subnet" {
  name          = "entregas-internas-subnet"
  ip_cidr_range = "10.10.0.0/20"
  region        = var.gcp_region
  network       = google_compute_network.vpc.id
}

# NOTA: Cloud SQL, Redis (Memorystore), Pub/Sub topics e as
# service accounts com IAM de menor privilégio ainda serão adicionados
# em módulos separados (infra/terraform/modules/) conforme a Fase 1
# avança — este arquivo cobre o setup inicial do GCP.
