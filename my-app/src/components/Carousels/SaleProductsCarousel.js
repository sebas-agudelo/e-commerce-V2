import { useRef, useState, useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, FreeMode, Mousewheel } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/mousewheel";
import "swiper/css/free-mode";

import { IoCheckmarkOutline } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";

export const SaleProductsCarousel = () => {
    const [superDeals, setSuperDeals] = useState([]);
    useEffect(() => {
        const superSaleProducts = async () => {
            const response = await fetch(`https://e-commerce-v2-hts6.vercel.app/superdeals`, {
                method: "GET",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();

            if (response.ok) {
                setSuperDeals(data.data);
            }
        }
        superSaleProducts()
    }, []);

    return (
        <div className="carousel-container">
            <h2>SUPER DEALS</h2>
            <Swiper
                modules={[Navigation, Pagination, FreeMode, Mousewheel]}
                navigation
                freeMode={true}
                mousewheel={{
                    forceToAxis: true,
                    releaseOnEdges: true
                }}
                loop={false}
                breakpoints={{
                    0: {
                        spaceBetween: 12,
                        slidesPerView: 1.4,
                        slidesPerGroup: 1
                    },
                    768: {
                        spaceBetween: 12,
                        slidesPerView: 2.4,
                        slidesPerGroup: 2
                    },
                    1024: {
                        spaceBetween: 12,
                        slidesPerView: 4,
                        slidesPerGroup: 4
                    }
                }}
            >
                 {superDeals.map((deal) => (
                    <SwiperSlide>
                        <Link to={`/product/${deal.id}`} className="swiper-carousel-content">
                            <div className="swiper-super-deals-img">
                                <img
                                    src={deal.img}
                                />
                            </div>
                            <div className="swiper-super-deals-info">
                                <p id="brand">{deal.brand}</p>
                                <p id="title">{deal.title}</p>
                                <ul>
                                    <li>
                                        {deal.category_name}
                                    </li>
                                    <li>
                                        Laddningstid: {deal.charging_time}h
                                    </li>
                                    <li>
                                        Batteritid: {deal.battery_life}h
                                    </li>
                                </ul>

                                <p id="price">{deal.price} kr.</p>
                                <p id="sale-price">{deal.sale_price}.00 kr.</p>

                                <p className="purchase_count">{deal.purchase_count > 0 ? <span className="mark">< IoCheckmarkOutline /></span> : <span className="closee">< IoCloseOutline /></span>} i lager</p>
                            </div>
                            {deal.purchase_count === 0 &&
                                <div className="out-of-stock">
                                    <p>Tillfälligt slut</p>
                                </div>
                            }
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}