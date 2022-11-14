/*
 * @Author: Derek Xu
 * @Date: 2022-07-14 15:50:29
 * @LastEditors: Derek Xu
 * @LastEditTime: 2022-11-14 16:45:08
 * @FilePath: \xut-calendar-vant-weapp\src\pages\privacyrule\index.tsx
 * @Description:
 *
 * Copyright (c) 2022 by 楚恬商行, All Rights Reserved.
 */
import Unite from '@antmjs/unite'
import { View } from '@tarojs/components'
import Container from '@/components/container'
import { useNav } from '@/utils'
import './index.less'

export default Unite(
  {
    state: {},
    async onLoad() {}
  },
  function ({}) {
    const usedNav = useNav()

    return (
      <Container navTitle='隐私保护协议' enablePagePullDownRefresh={false} useNav={usedNav} useMenuBtns={usedNav} className='pages-privacy-rule-index'>
        <View className='header'>
          <View className='title'>楚日历隐私保护协议</View>
        </View>
        <View className='warn'>
          <View className='title'> 【特别提示】 </View>
          <View className='section'>为方便您理解和阅读本指引，我们试图采用简洁明了的语言向您呈现本指引的各项内容。</View>
        </View>
        <View className='push-time'>
          <View>更新日期: 2022年1月1日</View>
          <View>生效日期: 2022年1月1日</View>
        </View>
        <View>
          <View
            className='preface'
            style={{ marginBottom: process.env.TARO_ENV === 'h5' ? '100px' : '0px', paddingBottom: process.env.TARO_ENV === 'h5' ? '20px' : '10px' }}
          >
            <View className='title'> 【政策摘要】 </View>
            <View className='section'>
              您的个人信息安全对我们来说至关重要，我们尊重并保护所有使用《楚日历》平台服务的用户的个人隐私权，并将依据《中华人民共和国网络安全法》、《信息安全技术个人信息安全规范》（GB/T
              35273-2017）及其他相关法律法规和技术规范收集和使用您的个人信息，以帮助我们向您提供更优质的产品和/或服务。
            </View>
            <View className='section'>
              本指引将呈现我们收集和使用您个人信息的情况，以及您享有的对个人信息的控制权。我们承诺会对您的个人信息和其它数据进行严格保密，并严格按照本指引所阐述的内容处理您的个人信息。我们会根据您的同意和其它可处理您个人信息的法律依据收集、使用、存储、共享和转移您的个人信息。
            </View>
            <View className='section'>
              请您在使用我们的各项产品和/或服务前，仔细阅读并充分理解本指引，尤其是我们已通过加粗、下划线等方式重点提示您的内容，希望您特别关注。一旦您使用或继续使用《楚日历》平台的产品/服务，即表示您同意我们按照本指引（含更新版本）处理您的相关信息。如对本指引有任何疑问，您可以通过页面中提供的联系方式/客服系统与我们联系。
            </View>
            <View className='section'>
              我们可能会不时对《楚日历隐私政策指引》进行修订。当《楚日历隐私政策指引》发生变更时，我们会在版本更新后以推送通知、弹窗等形式向您展示变更后的内容。
            </View>
            <View className='catalogue'>
              <View className='item'>
                <View className='title'> 目录：</View>
                <View className='catalogue-item'>
                  <View>一 运营者基本情况</View>
                  <View>二 适用范围</View>
                  <View>三 我们如何收集和使用您的个人信息</View>
                  <View>四 我们如何共享、公开披露您的个人信息</View>
                  <View>五 我们如何保护您的个人信息</View>
                  <View>六 您管理个人信息的权利</View>
                  <View>七 您个人信息的存储</View>
                  <View>八 我们如何使用 Cookie 和其他追踪技术</View>
                  <View>九 我们服务的对象及未成年人保护措施</View>
                  <View>十 如何更新与修改本指引</View>
                  <View>十一 争议解决</View>
                </View>
              </View>
              <View className='item'>
                <View className='title'>第一条 运营者基本情况</View>
                <View>
                  “【楚日历】平台”是【楚恬商行】公司（以下简称“我们”）合法运营的移动应用软件及其他合法网络渠道。我们将依据相关法律法规、规范性文件的规定为您提供服务
                  我们的注册地址：【宁夏吴忠市利通区】。如您对本指引或我们提供的产品/服务有任何疑问，您通过楚日历微信小程序反馈或向我们的官方邮箱【jianhao2010303@163.com】发送邮件与我们联系。
                  一般情况下，我们将在15个工作日内答复您。
                </View>
              </View>
              <View className='item'>
                <View className='title'>第二条 适用范围</View>
                <View>本指引适用于楚日历提供的所有服务，您使用楚日历提供的服务，均适用本指引。</View>
              </View>
              <View className='item'>
                <View className='title'>第三条 我们如何收集和使用您的个人信息</View>
                <View>
                  我们会遵循正当、合法、必要的原则，出于本指引所述的以下目的，收集和使用您在使用服务过程中主动提供、因使用楚日历产品和/或服务而产生的个人信息、或经您授权向第三方合法持有您信息的数据机构收集您的个人信息。
                </View>
                <View>
                  如果我们要将您的个人信息用于本指引未载明的其它用途，或基于特定目的将收集而来的信息用于其他目的，我们将以合理的方式向您告知，并在使用前再次征得您的同意。
                </View>
                <View className='itemize'>
                  <View className='title'>3.1 当您注册使用楚日历个人账号时，我们需要您提供一些信息：</View>
                  <View className='desc'>
                    <View className='ul'>
                      <View>3.1.1 </View>
                      <View className='right'>如果您选择新建账号，您需要输入您的账号/邮箱/手机号及密码，用于根据您的要求为您建立服务账号。</View>
                    </View>
                    <View className='ul'>
                      <View>3.1.2 </View>
                      <View className='right'>
                        如果您选择使用微信（微信ID）注册，您需要提供您的微信账号、头像、手机号码、地区（位置），用于建立您的账号服务。
                      </View>
                    </View>
                  </View>
                </View>
                <View className='itemize'>
                  <View className='title'>
                    3.2 当您使用楚日历时，我们会收集您的IP地址，我们使用此数据为了让您连接我们的服务器，如果您拒绝提供，则无法正常使用我们的服务。
                  </View>
                </View>
                <View className='itemize'>
                  <View className='title'>3.3 在您使用服务过程中收集的信息 为了向您提供更优质的产品和服务，我们可能需要收集下述信息:</View>
                  <View className='regulations'>
                    <View>（一）我们可能使用Cookice标识符及其他相关技术收集您的信息，为您提供个性化的服务体验。</View>
                    <View>
                      <View> （二）定向推送</View>
                      <View>
                        为向您使用终端适配消息推送功能，楚日历平台可能会自动接收并记录的您的手机上的信息，包括但不限于您使用的语言、访问日期和时间、软硬件特征信息、您主动填写的个人信息（姓名、手机号、地址等用于提供服务）及您需求的网页记录等数据信息来实现上述功能，如您拒绝使用上述推送功能，您可随时通过关闭设备的通知访问权限取消推送功能。
                      </View>
                    </View>
                    <View>
                      <View> （三）客户服务</View>
                      <View>
                        当您向楚日历提起投诉、申诉或进行咨询时，为了方便与您联系或帮助您解决问题，我们可能需要您提供姓名、手机号码、电子邮件及其他联系方式等个人信息。如您拒绝提供上述信息，我们可能无法向您及时反馈投诉、申诉或咨询结果。
                      </View>
                    </View>
                    <View>
                      <View> （四）其他用途</View>
                      <View>
                        当楚日历要将您的个人信息用于本隐私声明未载明的其他用途，或将基于特定目的收集而来的个人信息用于其他目的时，会事先征求您的同意，但以下情况除外：
                        <br></br>
                        1、与国家安全、国防安全有关的；
                        <br></br>
                        2、与公共安全、公共卫生、重大公共利益有关的；
                        <br></br>
                        3、与犯罪侦查、起诉、审判和判决执行等有关的；
                        <br></br>
                        4、出于维护您或其他个人的生命、财产等重大合法权益但又很难得到您本人同意的；
                        <br></br>
                        5、所收集的个人信息是您自行向社会公众公开的；
                        <br></br>
                        6、从合法公开披露的信息中收集个人信息的，如合法的新闻报道、政府信息公开等渠道；
                        <br></br>
                        7、用于维护所提供的产品或服务的安全稳定运行所必需的，例如发现、处置产品或服务的故障；
                        <br></br>
                        8、基于公共利益开展统计或学术研究所必要，且对外提供学术研究或描述的结果时，对结果中所包含的个人信息进行去标识化处理的；
                        <br></br>
                        9、法律法规规定的其他情形。
                      </View>
                    </View>
                  </View>
                  <View className='itemize'>
                    <View className='title'>3.4 敏感信息</View>
                    <View>
                      在向楚日历提供任何属于敏感信息的个人信息前，请您清楚考虑该等提供是恰当的并且同意您的个人敏感信息可按本指引所述的目的和方式进行处理。
                      我们会在得到您的同意后收集和使用您的敏感信息以实现与楚日历业务相关的功能。
                    </View>
                  </View>
                </View>
              </View>
              <View className='item'>
                <View className='title'>第四条 我们如何共享、公开披露您的个人信息：</View>
                <View className='itemize'>
                  <View className='title'> 4.1 共享您的个人信息 我们不会与任何公司、组织和个人共享您的个人信息，但以下情况除外：</View>
                  <View className='desc'>
                    <View className='ul'>
                      <View>4.1.1 </View>
                      <View className='right'>为向您提供软件技术支持辅助服务；</View>
                    </View>
                    <View className='ul'>
                      <View>4.1.2 </View>
                      <View className='right'>事先获得您的明确授权或同意：获得您的明确同意后，我们会与其他方共享您的个人信息；</View>
                    </View>
                    <View className='ul'>
                      <View>4.1.3 </View>
                      <View className='right'>在法定情形下的共享：根据适用的法律法规、法律程序、政府的强制命令或司法裁定而需共享您的个人信息；</View>
                    </View>
                    <View className='ul'>
                      <View>4.1.4 </View>
                      <View className='right'>
                        在法律要求或允许的范围内，为了保护楚日历平台及其用户或社会公众的利益、财产或安全免遭损害而有必要提供您的个人信息给第三方；
                      </View>
                    </View>
                    <View className='ul'>
                      <View>4.1.5 </View>
                      <View className='right'>
                        与我们的关联公司共享：您的个人信息可能会在我们的关联公司之间共享。我们只会共享必要的个人信息，且这种共享受本指引所声明目的的约束。关联公司如要改变个人信息的处理目的，将再次征求您的授权同意；
                      </View>
                    </View>
                    <View className='ul'>
                      <View>4.1.6 </View>
                      <View className='right'>
                        优质的产品和服务，我们的某些服务将由授权合作伙伴提供。我们可能会与合作伙伴共享您的某些个人信息，以提供更好的客户服务和用户体验。我们仅会出于合法、正当、必要、特定、明确的目的共享您的个人信息，并且只会共享提供服务所必要的个人信息。同时，我们会与合作伙伴签署严格的保密协定，要求他们按照我们的说明、本指引以及其他任何相关的保密和安全措施来处理您的个人信息。我们的合作伙伴无权将共享的个人信息用于任何其他用途。如果您拒绝我们的合作伙伴在提供服务时收集为提供服务所必须的个人信息，将可能导致您无法在楚日历中使用该第三方服务。
                      </View>
                    </View>
                  </View>
                </View>
                <View className='itemize'>
                  <View className='title'> 4.2 转让 除非获取您的明确同意，我们不会将您的个人信息转让给任何公司、组织或个人，但以下情形除外：</View>
                  <View>
                    <View className='desc'>
                      <View className='ul'>
                        <View>4.2.1 </View>
                        <View className='right'>
                          如果发生合并、收购或破产清算，将可能涉及到个人信息转让，此种情况下我们会要求新的持有您个人信息的公司、组织继续受本指引的约束。如果本指引中约定的个人信息的收集、处理方式发生任何改变，该公司、组织将重新向您征求授权同意；
                        </View>
                      </View>
                      <View className='ul'>
                        <View>4.2.2 </View>
                        <View className='right'>在获取明确同意的情况下转让：获得您的明确同意后，楚日历可向其他方转让您的个人信息。</View>
                      </View>
                    </View>
                  </View>
                </View>
                <View className='itemize'>
                  <View className='title'> 4.3 公开披露 我们不会与任何公司、组织和个人公开披露您的个人信息，但以下情况除外：</View>
                  <View className='desc'>
                    <View className='ul'>
                      <View>4.3.1 </View>
                      <View className='right'>事先获得您的明确授权或同意；</View>
                    </View>
                    <View className='ul'>
                      <View>4.3.2 </View>
                      <View className='right'>
                        基于法律、法律程序、诉讼或政府主管部门强制性要求的情况下，我们可能会向有权机关披露您的个人信息。但我们保证，在上述情况发生时，我们会要求披露请求方必须出具与之相应的有效法律文件，并对被披露的信息采取符合法律和业界标准的安全防护措施。
                      </View>
                    </View>
                  </View>
                </View>
                <View className='itemize'>
                  <View className='title'> 4.4 共享、转让、公开披露个人信息授权同意的例外</View>
                  <View>
                    <View>根据相关法律法规的规定，在以下情形中，我们可以在不征得您的授权同意的情况下共享、转让、公开披露您的个人信息：</View>
                    <View className='desc'>
                      <View className='ul'>
                        <View>4.4.1 </View>
                        <View className='right'>与国家安全、国防安全有关的；</View>
                      </View>
                      <View className='ul'>
                        <View>4.4.2 </View>
                        <View className='right'>与公共安全、公共卫生、重大公共利益有关的；</View>
                      </View>
                      <View className='ul'>
                        <View>4.4.3 </View>
                        <View className='right'>与犯罪侦查、起诉、审判和判决执行等有关的；</View>
                      </View>
                      <View className='ul'>
                        <View>4.4.4 </View>
                        <View className='right'>出于维护您或其他个人的生命、财产等重大合法权益但又很难得到本人同意的；</View>
                      </View>
                      <View className='ul'>
                        <View>4.4.5 </View>
                        <View className='right'>您自行向社会公众公开的个人信息；</View>
                      </View>
                      <View className='ul'>
                        <View>4.4.6 </View>
                        <View className='right'>从合法公开披露的信息中收集到的个人信息的，如合法的新闻报道、政府信息公开等渠道；</View>
                      </View>
                      <View className='ul'>
                        <View>4.4.7 </View>
                        <View className='right'>法律法规规定的其他情形。</View>
                      </View>
                      <View className='ul'>
                        <View>4.4.8 </View>
                        <View className='right'>
                          根据法律规定，共享、转让经去标识化处理的个人信息，且确保数据接收方无法复原并重新识别个人信息主体的，不属于个人信息的对外共享、转让及公开披露行为，对此类数据的保存及处理将无需另行向您通知并征得您的同意。
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View className='item'>
                <View className='title'> 第五条 我们如何保护您的个人信息</View>
                <View>
                  您的个人信息安全对于我们至关重要。我们将严格遵守相关法律法规，采取业内认可的合理可行的措施，保护您的个人信息。防止信息遭到未经授权的访问、披露、使用、修改，避免信息损坏或丢失。
                </View>
                <View>
                  我们仅在本隐私政策指引所述目的所必需的期间和法律法规要求的时限内保留您的个人信息。为保障您的信息安全，我们积极建立数据分类分级制度、努力采取各种合理的物理、电子和管理方面的安全措施来保护您的信息，防止数据遭到未经授权的访问、使您的信息不会被泄漏、毁损或者丢失，包括但不限于SSL、信息加密存储、数据中心的访问控制。
                </View>
                <View>
                  我们对可能接触到您个人信息的员工或外包人员也采取了严格管理，包括但不限于信息访问权限控制、与接触个人信息的人员签署保密协议、监控该等人员的操作情况等措施。我们会按现有技术提供相应的安全措施来保护您的信息，提供合理的安全保障，我们将尽力做到使您的信息不被泄漏、毁损或丢失。
                </View>
                <View>
                  楚日历平台的注册账户信息（包括帐户名及密码信息）为非常重要的个人信息，请您妥善设置、保管您的注册账户信息。楚日历将通过备份、对密码进行加密等安全措施尽力保护您的注册帐户信息等个人信息不丢失、不被滥用和变造。
                </View>
              </View>
              <View className='item'>
                <View className='title'>第六条 您管理个人信息的权利</View>
                <View>
                  我们非常重视您对个人信息的关注，并尽全力保护您对于自己个人信息访问、更正、删除以及撤回同意的权利，以使您拥有充分的能力保障您的隐私和安全。您的权利包括：
                </View>
                <View className='itemize'>
                  <View className='desc'>
                    <View className='ul'>
                      <View>6.1.1 </View>
                      <View className='right'>访问和更正您的个人信息 除法律法规规定外，您有权随时访问、更正您的个人信息。</View>
                    </View>
                    <View className='ul'>
                      <View>6.1.2 </View>
                      <View className='right'>
                        改变您授权同意的范围：
                        <View>
                          我们在提供服务的过程中，可能需要您开通一些设备权限，例如通知、手机通讯录、蓝牙等访问权限。您也可以在设备的【设置】功能中随时选择关闭部分或者全部权限，从而拒绝我们收集您相应的个人信息。在不同设备中，权限显示方式及关闭方式可能有所不同，具体请参考设备及系统开发方说明或指引。
                        </View>
                      </View>
                    </View>
                    <View className='ul'>
                      <View>6.1.3 </View>
                      <View className='right'>
                        注销您的帐号
                        <View>
                          如果您需要注销您的【楚日历】帐号，您可以通过「客服电话」联系我们，要求对您的【楚日历】帐号进行注销。我们将在验证您的身份并清理帐号中的资产（包括存管账户余额等）后，为您提供帐号注销服务。
                        </View>
                        <View>
                          为了向您提供更加便捷的注销方式，我们后续会不断优化我们的产品，并且通过页面公告向您告知。在注销帐号之后，我们将停止为您提供产品或服务，并依据您的要求，删除您的个人信息，法律法规另有规定的除外。
                        </View>
                      </View>
                    </View>
                    <View className='ul'>
                      <View>6.1.4 </View>
                      <View className='right'>
                        响应您的上述请求 为保障安全，我们可能会先要求您验证自己的身份，然后再处理您的请求。您可能需要提供书面请求，或以其他方式证明您的身份。
                      </View>
                    </View>
                    <View className='ul'>
                      <View>6.1.5 </View>
                      <View className='right'>
                        对于您合理的请求，我们原则上不收取费用，但对多次重复、超出合理限度的请求，我们将视情收取一定成本费用。对于那些无端重复、需要过多技术手段（例如，需要开发新系统或从根本上改变现行惯例）、给他人合法权益带来风险或者非常不切实际（例如，涉及备份磁带上存放的信息）的请求，我们可能会予以拒绝。
                      </View>
                    </View>
                    <View className='ul'>
                      <View>6.1.5 </View>
                      <View className='right'>
                        在以下情形中，按照法律法规要求，我们将无法响应您的请求：
                        <View>与国家安全、国防安全直接相关的；</View>
                        <View>与公共安全、公共卫生、重大公共利益直接相关的；</View>
                        <View>与犯罪侦查、起诉、审判和判决执行等直接相关的；</View>
                        <View>有充分证据表明您存在主观恶意或滥用权利的；</View>
                        <View>响应您的请求将导致您或其他个人、组织的合法权益受到严重损害的。</View>
                        <View>涉及商业秘密的。</View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View className='item'>
                <View className='title'>第七条 您个人信息的存储</View>
                <View>
                  我们将从中华人民共和国境内获得的信息存放于中华人民共和国境内。如果发生数据的跨境传输，我们会单独向您以弹窗或邮件的方式告知您数据出境的目的、接收方等，并征得您的授权同意，我们会确保数据接收方有充足的数据保护能力来保护您的个人信息。
                </View>
                <View>
                  我们仅在本隐私条款所述目的所必需的期间和法律法规要求的最短时限内保留您的个人信息，对于超出期限的个人信息，我们会立即删除或做匿名化处理。
                </View>
                <View>
                  如我们因经营不善或其他原因出现停止运营的情况，我们会立即停止对您个人信息的收集，删除已收集的个人信息。我们会将此情况在网站上进行公告或以站内信、邮件等其他合理方式逐一传达到各个用户。
                </View>
              </View>
              <View className='item'>
                <View className='title'>第八条 我们服务的对象及未成年人保护措施</View>
                <View className='itemize'>
                  <View className='desc'>
                    <View className='ul'>
                      <View>8.1.1 </View>
                      <View className='right'>
                        我们重视未成年人的信息保护。如您为未成年人，您务必请您的父母或监护人仔细阅读本隐私声明，并在征得您父母或监护人同意的前提下才能向我们提供信息、使用楚日历平台的服务或购买相关商品、参与抽奖等。
                      </View>
                    </View>
                    <View className='ul'>
                      <View>8.1.2 </View>
                      <View className='right'>
                        受限于信息技术，在注册成为楚日历用户时，我们可能无法核验您的年龄或身份，如您不慎注册了楚日历，请您及时联系我们删除您的相关数据信息。
                      </View>
                    </View>
                    <View className='ul'>
                      <View>8.1.3 </View>
                      <View className='right'>
                        在您申请我们的产品和/或服务时，我们将对您主动提交的、或来自于第三方的关于您的信息进行验证/核实，为保护您的合法权益，如经验证您是未成年人，我们将拒绝向您提供产品和/或服务，并将尽快删除您的相关数据信息。
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View className='item'>
                <View className='title'>第九条 如何更新与修改本指引</View>
                <View>
                  我们可能适时修订本隐私声明，一旦本隐私声明内容发生变更，我们楚日历会于楚日历平台公布最新的隐私声明，并通过显著的方式通知您。若您在本隐私声明修订后继续使用楚日历提供的产品或服务，这表示您已充分阅读、理解并愿意受修订后的隐私声明约束。
                </View>
              </View>
              <View className='item'>
                <View className='title'>第十条 争议解决</View>
                <View className='itemize'>
                  <View className='desc'>
                    <View className='ul'>
                      <View>10.1.1 </View>
                      <View className='right'>
                        因本指引以及我们处理您个人信息事宜引起的任何争议，您可诉至本协议签订地【宁夏回族自治区吴忠市利通区】有管辖权的人民法院。
                      </View>
                    </View>
                    <View className='ul'>
                      <View>10.1.2 </View>
                      <View className='right'>如果您认为我们的个人信息处理行为损害了您的合法权益，您也可向有关政府部门进行反映。</View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Container>
    )
  },
  { page: true }
)

definePageConfig({
  // 这里不要设置标题，在Container组件上面设置
  navigationBarTitleText: ''
})
