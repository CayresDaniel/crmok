// src/evolution/evolution.types.ts
export interface MessageResult {
  contact: string;
  success: boolean;
  result?: any;
  error?: string;
}

export interface SendBirthdayMessageDto {
  contacts: string[];
  message: string;
}

export interface SendCampaignMessageDto {
  contacts: string[];
  message: string;
}