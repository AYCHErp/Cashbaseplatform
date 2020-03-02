import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { formatDate, formatCurrency } from '@angular/common';

import { ProgramsServiceApiService } from 'src/app/services/programs-service-api.service';

import { Program } from 'src/app/models/program.model';
import { ProgramMetrics, MetricRow, MetricGroup } from 'src/app/models/program-metrics.model';
import { TranslatableStringService } from 'src/app/services/translatable-string.service';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss'],
})
export class MetricsComponent implements OnChanges {
  @Input()
  private program: Program;
  private locale: string;
  private programMetrics: ProgramMetrics;
  private metricsMap: Map<string, MetricRow> = new Map();

  public metricList: MetricRow[];
  public lastUpdated: string;

  constructor(
    private translate: TranslateService,
    private translatableString: TranslatableStringService,
    private programService: ProgramsServiceApiService,
  ) {
    this.locale = this.translate.getBrowserCultureLang();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.program && typeof changes.program.currentValue === 'object') {
      this.update();
    }
  }

  public async update() {
    this.programMetrics = await this.programService.getMetricsById(this.program.id);

    this.renderUpdated();

    // The order of these methods, define the order of the metricMap/List:
    this.renderProgramProperties();
    this.renderFinancialMetrics();
    this.renderPaMetrics();
    this.renderAidWorkerMetrics();

    // Convert to array, for use in template:
    this.metricList = Array.from(this.metricsMap.values());
  }

  private renderUpdated() {
    this.lastUpdated = this.getValueOrUnknown(this.programMetrics.updated, (value) => formatDate(value, 'full', this.locale));
  }

  private renderProgramProperties() {
    const group = MetricGroup.programProperties;

    this.metricsMap.set(`${group}.title`, {
      group,
      icon: 'document',
      label: 'page.program.program-details.title',
      value: this.getValueOrEmpty(this.program.title, (value) => this.translatableString.get(value)),
    });
    this.metricsMap.set(`${group}.startDate`, {
      group,
      icon: 'calendar',
      label: 'page.program.program-details.startDate',
      value: this.getValueOrEmpty(this.program.startDate, (value) => formatDate(value, 'shortDate', this.locale)),
    });
    this.metricsMap.set(`${group}.endDate`, {
      group,
      icon: 'calendar',
      label: 'page.program.program-details.endDate',
      value: this.getValueOrEmpty(this.program.endDate, (value) => formatDate(value, 'shortDate', this.locale)),
    });
    this.metricsMap.set(`${group}.location`, {
      group,
      icon: 'pin',
      label: 'page.program.program-details.location',
      value: this.getValueOrEmpty(this.program.location, (value) => this.translatableString.get(value)),
    });
  }

  private renderFinancialMetrics() {
    const metrics = this.programMetrics.funding;
    const group = MetricGroup.financial;
    const currencyCode = this.program.currency;
    const symbol = `${currencyCode} `;
    const locale = this.locale;

    this.metricsMap.set(`${group}.financialServiceProviders`, {
      group,
      icon: 'card',
      label: 'page.program.program-details.financialServiceProviders',
      value: this.getValueOrEmpty(this.program.financialServiceProviders, (value) => value.length),
    });
    this.metricsMap.set(`${group}.descCashType`, {
      group,
      icon: 'card',
      label: 'page.program.program-details.descCashType',
      value: this.getValueOrEmpty(this.program.descCashType, (value) => this.translatableString.get(value)),
    });
    this.metricsMap.set(`${group}.distributionFrequency`, {
      group,
      icon: 'repeat',
      label: 'page.program.program-details.distributionFrequency',
      value: this.getValueOrEmpty(this.program.distributionFrequency, (value) => {
        return this.translate.instant('page.program.metrics.units.' + value);
      }),
    });
    this.metricsMap.set(`${group}.distributionDuration`, {
      group,
      icon: 'hourglass',
      label: 'page.program.program-details.distributionDuration',
      value: this.getValueOrEmpty(this.program.distributionDuration, (value) => {
        return `${value} ${this.translate.instant(
          'page.program.metrics.units.' + this.program.distributionFrequency
        )}`;
      }),
    });
    this.metricsMap.set(`${group}.fixedTransferValue`, {
      group,
      icon: 'gift',
      label: 'page.program.program-details.fixedTransferValue',
      value: this.getValueOrUnknown(this.program.fixedTransferValue, (value) => formatCurrency(value, locale, symbol, currencyCode)),
    });
    this.metricsMap.set(`${group}.totalRaised`, {
      group,
      icon: 'cash',
      label: 'page.program.metrics.funds.raised',
      value: this.getValueOrUnknown(metrics.totalRaised, (value) => formatCurrency(value, locale, symbol, currencyCode)),
    });
    this.metricsMap.set(`${group}.totalTransferred`, {
      group,
      icon: 'cash',
      label: 'page.program.metrics.funds.transferred',
      value: this.getValueOrUnknown(metrics.totalTransferred, (value) => formatCurrency(value, locale, symbol, currencyCode)),
    });
    this.metricsMap.set(`${group}.totalAvailable`, {
      group,
      icon: 'cash',
      label: 'page.program.metrics.funds.available',
      value: this.getValueOrUnknown(metrics.totalAvailable, (value) => formatCurrency(value, locale, symbol, currencyCode)),
    });
  }

  private renderPaMetrics() {
    const metrics = this.programMetrics.pa;
    const group = MetricGroup.pa;

    this.metricsMap.set(`${group}.targeted`, {
      group,
      icon: 'locate',
      label: 'page.program.metrics.pa.targeted',
      value: this.getValueOrEmpty(this.program.highestScoresX),
    });
    this.metricsMap.set(`${group}.pendingVerification`, {
      group,
      icon: 'people',
      label: 'page.program.metrics.pa.pending-verification',
      value: this.getValueOrUnknown(metrics.pendingVerification),
    });
    this.metricsMap.set(`${group}.verifiedAwaitingDecision`, {
      group,
      icon: 'contact',
      label: 'page.program.metrics.pa.verified-awaiting-decision',
      value: this.getValueOrUnknown(metrics.verifiedAwaitingDecision),
    });
    this.metricsMap.set(`${group}.included`, {
      group,
      icon: 'checkmark-circle-outline',
      label: 'page.program.metrics.pa.included',
      value: this.getValueOrUnknown(metrics.included),
    });
    this.metricsMap.set(`${group}.excluded`, {
      group,
      icon: 'close-circle',
      label: 'page.program.metrics.pa.excluded',
      value: this.getValueOrUnknown(metrics.excluded),
    });
  }

  private renderAidWorkerMetrics() {
    const group = MetricGroup.aidworkers;

    this.metricsMap.set(`${group}.assigned`, {
      group,
      icon: 'body',
      label: 'page.program.program-details.aidworkers',
      value: this.getValueOrEmpty(this.program.aidworkers, (value) => value.length),
    });
  }

  /**
   * Returns the output of `getValueToShow()` if `checkValue` is available or defined.
   * Otherwise, returns fallback-value: '-'
   */
  private getValueOrEmpty(checkValue, getValueToShow?: (value?: any) => number | string) {
    return this.getValueOrFallback('-', checkValue, getValueToShow);
  }

  /**
   * Returns the output of `getValueToShow()` if `checkValue` is available or defined.
   * Otherwise, returns fallback-value: '?'
   */
  private getValueOrUnknown(checkValue, getValueToShow?: (value?: any) => number | string) {
    return this.getValueOrFallback('?', checkValue, getValueToShow);
  }

  /**
   * Returns the output of `getValueToShow()` if `checkValue` is available or defined.
   * Otherwise, returns fallback-value
   */
  private getValueOrFallback(fallbackValue: string, checkValue, getValueToShow?: (value?: any) => number | string) {
    // If there is nothing sensible to display, show the fallback:
    if (typeof checkValue === 'undefined') {
      return fallbackValue;
    }

    // If available, use `getValueToShow()` to get 'something to display':
    if (typeof getValueToShow === 'function') {
      return getValueToShow(checkValue);
    }

    // If all else fails, just return checkValue to display:
    return checkValue;
  }
}
