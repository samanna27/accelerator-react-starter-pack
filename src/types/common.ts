
export type Filter = {
  pageCount?: string;
	type?: string;
	stringCount?: string;
	sort?: string;
  order?: string;
};

export type Coupon = {
  coupon: string | null;
};

export type CouponSent = {
  coupon: string;
};
