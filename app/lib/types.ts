export type Skill = {
  name: string;
  endorsements: number;
};

export type Experience = {
  title: string;
  company: string;
  period: string;
  description: string;
};

export type Education = {
  school: string;
  degree: string;
  field: string;
  year: string;
};

export type Profile = {
  id: string;
  username: string;
  display_name: string;
  species: string;
  title: string | null;
  company: string | null;
  location: string | null;
  bio: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  is_alpha: boolean;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  connections_count: number;
  created_at: string;
};

export type ReactionType = 'like' | 'celebrate' | 'paw' | 'roar' | 'curious' | 'support';

export type ReactionCounts = Partial<Record<ReactionType, number>>;

export type Comment = {
  id: string;
  post_id: string;
  author_id: string;
  author: Profile;
  content: string;
  created_at: string;
};

export type Post = {
  id: string;
  author_id: string;
  author: Profile;
  content: string;
  image_url: string | null;
  view_count: number;
  reaction_counts: ReactionCounts;
  comments: Comment[];
  share_count: number;
  created_at: string;
};

export type ConnectionStatus = 'none' | 'pending_sent' | 'pending_received' | 'connected';

export type Connection = {
  id: string;
  requester_id: string;
  receiver_id: string;
  requester?: Profile;
  receiver?: Profile;
  status: 'pending' | 'connected' | 'declined';
  created_at: string;
};

export type Job = {
  id: string;
  posted_by: string;
  poster: Profile;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary: string;
  species_tag: string | null;
  applicants_count: number;
  created_at: string;
};

export type NotificationType =
  | 'connection_request'
  | 'connection_accepted'
  | 'reaction'
  | 'comment'
  | 'job_application'
  | 'profile_view'
  | 'endorsement'
  | 'mention'
  | 'anniversary'
  | 'job_alert'
  | 'repost';

export type Notification = {
  id: string;
  user_id: string;
  actor_id: string | null;
  actor: Profile | null;
  type: NotificationType;
  entity_id: string | null;
  message: string;
  subtext: string | null;
  read: boolean;
  link: string | null;
  created_at: string;
};

export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

export type Subscription = {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_price_id: string;
  status: SubscriptionStatus;
  current_period_end: string;
};

export type CurrentUser = Profile & {
  email: string;
  subscription: Subscription | null;
};
