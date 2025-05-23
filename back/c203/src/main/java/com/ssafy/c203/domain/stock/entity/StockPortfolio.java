package com.ssafy.c203.domain.stock.entity;

import com.ssafy.c203.domain.members.entity.Members;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class StockPortfolio {

    @Id
    @GeneratedValue
    private Long id;

    @JoinColumn(name = "stock_id")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private StockItem stockItem;

    @JoinColumn(name = "member_id")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Members member;

    private Double amount;

    @Column(name = "price_avg")
    private Double priceAvg;

    public void addAmount(Double amount) {
        this.amount += amount;
    }

    public void subAmount(Double amount) {
        this.amount -= amount;
    }

    public void updatePriceAvg(Double priceAvg, Double newAmount) {
        this.priceAvg = (priceAvg * amount + priceAvg * newAmount) / (amount + newAmount);
    }
}
